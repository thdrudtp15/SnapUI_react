import postcss from 'postcss';

/**
 * CSS 문자열에서 특정 선택자와 관련된 규칙만 추출하는 함수
 *
 * 목적: 전체 CSS 파일에서 실제로 사용하는 선택자의 스타일만 뽑아내기
 * 예: ['.button', '.header']를 넘기면 이 선택자들과 관련된 CSS만 반환
 *
 * 지원 기능:
 * - 의사 클래스 (.button:hover)
 * - 의사 요소 (.button::before)
 * - 복합 선택자 (.parent .child)
 * - 미디어 쿼리 (@media)
 * - CSS 변수 (--color-primary)
 * - 애니메이션 (@keyframes)
 */
export function extractCSSRules(cssString: string, selectors: string[]): string {
    try {
        if (!cssString || !cssString.trim() || selectors.length === 0) {
            return cssString || '';
        }

        const root = postcss.parse(cssString);

        // 사용된 CSS 변수와 애니메이션 이름을 추적하기 위한 Set
        // 나중에 필요한 것만 포함시키기 위함
        const usedVariables = new Set<string>();
        const usedAnimations = new Set<string>();

        // 선택자가 매칭되는지 확인하는 함수
        const isMatchingSelector = (ruleSelector: string, targetSelector: string): boolean => {
            // 1. 정확히 일치: .button === .button
            if (ruleSelector === targetSelector) {
                return true;
            }

            // 2. 의사 클래스: .button:hover (::이 없어야 함)
            if (ruleSelector.startsWith(targetSelector + ':') && !ruleSelector.includes('::')) {
                return true;
            }

            // 3. 의사 요소: .button::before
            if (ruleSelector.startsWith(targetSelector + '::')) {
                return true;
            }

            // 4. 속성 선택자: .button[type="submit"]
            if (ruleSelector.startsWith(targetSelector + '[')) {
                return true;
            }

            // 5. 후손 선택자: .parent .child (공백으로 구분)
            const descendantPattern = new RegExp(`\\s+${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (descendantPattern.test(ruleSelector)) {
                return true;
            }

            // 6. 자식 선택자: .parent > .child
            const childPattern = new RegExp(`>\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (childPattern.test(ruleSelector)) {
                return true;
            }

            // 7. 인접 형제: .prev + .next
            const adjacentPattern = new RegExp(`\\+\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (adjacentPattern.test(ruleSelector)) {
                return true;
            }

            // 8. 일반 형제: .prev ~ .sibling
            const siblingPattern = new RegExp(`~\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (siblingPattern.test(ruleSelector)) {
                return true;
            }

            return false;
        };

        // CSS 규칙을 처리하고 매칭 여부 반환
        const processRule = (rule: postcss.Rule): boolean => {
            // 쉼표로 구분된 선택자 분리 (.a, .b { ... })
            const selList = rule.selector.split(',').map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').trim());

            // 하나라도 매칭되면 keep = true
            const keep = selList.some((ruleSelector) => {
                return selectors.some((targetSelector) => {
                    return isMatchingSelector(ruleSelector, targetSelector);
                });
            });

            // 매칭된 규칙에서 사용하는 CSS 변수와 애니메이션 수집
            if (keep) {
                rule.walkDecls((decl) => {
                    // CSS 변수 추출: color: var(--primary-color)
                    const varMatches = decl.value.match(/var\(--[\w-]+\)/g);
                    if (varMatches) {
                        varMatches.forEach((v) => {
                            const varName = v.match(/--[\w-]+/)?.[0];
                            if (varName) {
                                usedVariables.add(varName);
                            }
                        });
                    }

                    // 애니메이션 이름 추출: animation: fadeIn 1s ease
                    if (decl.prop === 'animation' || decl.prop === 'animation-name') {
                        const animationNames = decl.value
                            .split(',')
                            .map((anim) => anim.trim().split(/\s+/)[0]) // 첫 번째 단어가 애니메이션 이름
                            .filter((name) => name && name !== 'none');

                        animationNames.forEach((name) => usedAnimations.add(name));
                    }
                });
            }

            return keep;
        };

        // 1. 최상위 CSS 규칙 처리
        root.walkRules((rule) => {
            // @media 안이 아닌 최상위 규칙만
            if (rule.parent?.type === 'root') {
                const keep = processRule(rule);

                // 매칭 안 되면 주석 처리 (삭제 대신)
                if (!keep) {
                    rule.replaceWith(
                        postcss.comment({
                            text: `EXTRACTED-CSS-START\n${rule.toString()}\nEXTRACTED-CSS-END`,
                        })
                    );
                }
            }
        });

        // 2. @media 쿼리 내부 규칙 처리
        root.walkAtRules('media', (mediaRule) => {
            let hasMatchingRule = false;

            mediaRule.walkRules((rule) => {
                const keep = processRule(rule);

                if (keep) {
                    hasMatchingRule = true;
                } else {
                    rule.replaceWith(
                        postcss.comment({
                            text: `EXTRACTED-CSS-START\n${rule.toString()}\nEXTRACTED-CSS-END`,
                        })
                    );
                }
            });

            // @media 안에 매칭되는 규칙이 하나도 없으면 블록 전체 제거
            if (!hasMatchingRule) {
                mediaRule.remove();
            }
        });

        // 3. 사용된 CSS 변수 정의 추출
        // :root { --primary-color: blue; } 형태로 정의된 변수 중 사용된 것만
        if (usedVariables.size > 0) {
            const extractedVars: string[] = [];

            root.walkRules((rule) => {
                if (rule.selector === ':root' || rule.selector === 'html' || rule.selector === '*') {
                    rule.walkDecls((decl) => {
                        if (decl.prop.startsWith('--') && usedVariables.has(decl.prop)) {
                            extractedVars.push(`  ${decl.toString()}`);
                        }
                    });
                }
            });

            // 사용된 변수를 :root 블록으로 최상단에 추가
            if (extractedVars.length > 0) {
                const varBlock = postcss.rule({
                    selector: ':root',
                });

                extractedVars.forEach((varDecl) => {
                    const [prop, value] = varDecl
                        .trim()
                        .split(':')
                        .map((s) => s.trim());
                    varBlock.append(
                        postcss.decl({
                            prop: prop,
                            value: value.replace(/;$/, ''),
                        })
                    );
                });

                root.prepend(varBlock);
            }
        }

        // 4. 사용된 @keyframes 애니메이션만 추출
        const keyframesToKeep: postcss.AtRule[] = [];

        root.walkAtRules('keyframes', (keyframeRule) => {
            const animationName = keyframeRule.params;

            if (usedAnimations.has(animationName)) {
                keyframesToKeep.push(keyframeRule.clone());
            }

            // 일단 전부 제거
            keyframeRule.remove();
        });

        // 사용된 것만 다시 추가
        keyframesToKeep.forEach((keyframe) => {
            root.append(keyframe);
        });

        // 5. @font-face는 제거 (폰트 추적은 구현 안 됨)
        root.walkAtRules('font-face', (atrule) => {
            atrule.remove();
        });

        return root.toString();
    } catch (error) {
        console.error('CSS 파싱 중 오류 발생:', error);
        return `/* CSS 파싱 오류 발생: ${error instanceof Error ? error.message : 'Unknown error'} */\n${cssString}`;
    }
}

/**
 * 정규식 특수문자 이스케이프
 * 예: ".button" → "\\.button" (점이 정규식에서 "모든 문자"를 의미하지 않도록)
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
