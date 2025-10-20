import postcss from 'postcss';

/**
 * CSS 문자열에서 특정 선택자와 관련된 규칙을 추출합니다.
 * 의사 클래스(:hover, :focus), 의사 요소(::before, ::after),
 * 복합 선택자(.parent .child), 미디어 쿼리(@media),
 * CSS 변수(--custom-property), 애니메이션(@keyframes)을 지원합니다.
 *
 * @param cssString - 파싱할 CSS 문자열
 * @param selectors - 추출할 선택자 배열 (예: ['.button', '#header'])
 * @returns 매칭된 규칙만 포함하거나, 매칭되지 않은 규칙은 주석 처리된 CSS 문자열
 */
export function extractCSSRules(cssString: string, selectors: string[]): string {
    try {
        // 빈 문자열이나 빈 선택자 배열 처리
        if (!cssString || !cssString.trim() || selectors.length === 0) {
            return cssString || '';
        }

        const root = postcss.parse(cssString);
        const usedVariables = new Set<string>();
        const usedAnimations = new Set<string>();

        // 선택자 매칭 헬퍼 함수
        const isMatchingSelector = (ruleSelector: string, targetSelector: string): boolean => {
            // 정확히 일치하는 경우
            if (ruleSelector === targetSelector) {
                return true;
            }

            // 의사 클래스 지원 (:hover, :focus, :active 등)
            if (ruleSelector.startsWith(targetSelector + ':') && !ruleSelector.includes('::')) {
                return true;
            }

            // 의사 요소 지원 (::before, ::after, ::placeholder 등)
            if (ruleSelector.startsWith(targetSelector + '::')) {
                return true;
            }

            // 속성 선택자 지원 ([type="text"])
            if (ruleSelector.startsWith(targetSelector + '[')) {
                return true;
            }

            // 후손 선택자 (.parent .child)
            const descendantPattern = new RegExp(`\\s+${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (descendantPattern.test(ruleSelector)) {
                return true;
            }

            // 자식 선택자 (.parent > .child)
            const childPattern = new RegExp(`>\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (childPattern.test(ruleSelector)) {
                return true;
            }

            // 인접 형제 선택자 (.prev + .next)
            const adjacentPattern = new RegExp(`\\+\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (adjacentPattern.test(ruleSelector)) {
                return true;
            }

            // 일반 형제 선택자 (.prev ~ .sibling)
            const siblingPattern = new RegExp(`~\\s*${escapeRegExp(targetSelector)}(?:[\\s:.[\\]]|$)`);
            if (siblingPattern.test(ruleSelector)) {
                return true;
            }

            return false;
        };

        // 규칙 처리 및 CSS 변수/애니메이션 수집 헬퍼 함수
        const processRule = (rule: postcss.Rule): boolean => {
            const selList = rule.selector
                .split(',')
                .map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').trim());

            const keep = selList.some((ruleSelector) => {
                return selectors.some((targetSelector) => {
                    return isMatchingSelector(ruleSelector, targetSelector);
                });
            });

            // 매칭된 규칙에서 CSS 변수와 애니메이션 사용 확인
            if (keep) {
                rule.walkDecls((decl) => {
                    // CSS 변수 사용 확인 (var(--variable-name))
                    const varMatches = decl.value.match(/var\(--[\w-]+\)/g);
                    if (varMatches) {
                        varMatches.forEach((v) => {
                            const varName = v.match(/--[\w-]+/)?.[0];
                            if (varName) {
                                usedVariables.add(varName);
                            }
                        });
                    }

                    // animation 또는 animation-name 속성 확인
                    if (decl.prop === 'animation' || decl.prop === 'animation-name') {
                        // animation: name duration timing-function 형식 파싱
                        const animationNames = decl.value
                            .split(',')
                            .map((anim) => anim.trim().split(/\s+/)[0])
                            .filter((name) => name && name !== 'none');

                        animationNames.forEach((name) => usedAnimations.add(name));
                    }
                });
            }

            return keep;
        };

        // 1. 일반 규칙 처리
        root.walkRules((rule) => {
            // @media 내부가 아닌 최상위 규칙만 처리
            if (rule.parent?.type === 'root') {
                const keep = processRule(rule);

                if (!keep) {
                    rule.replaceWith(
                        postcss.comment({
                            text: `EXTRACTED-CSS-START\n${rule.toString()}\nEXTRACTED-CSS-END`,
                        })
                    );
                }
            }
        });

        // 2. @media 쿼리 처리
        root.walkAtRules('media', (mediaRule) => {
            let hasMatchingRule = false;

            mediaRule.walkRules((rule) => {
                const keep = processRule(rule);

                if (keep) {
                    hasMatchingRule = true;
                } else {
                    // 매칭되지 않는 규칙은 주석 처리
                    rule.replaceWith(
                        postcss.comment({
                            text: `EXTRACTED-CSS-START\n${rule.toString()}\nEXTRACTED-CSS-END`,
                        })
                    );
                }
            });

            // @media 블록 내에 매칭되는 규칙이 없으면 전체 블록 제거
            if (!hasMatchingRule) {
                mediaRule.remove();
            }
        });

        // 3. CSS 변수 정의 추출 (:root, html)
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

            // 사용된 CSS 변수가 있으면 최상단에 추가
            if (extractedVars.length > 0) {
                const varBlock = postcss.rule({
                    selector: ':root',
                });

                extractedVars.forEach((varDecl) => {
                    const [prop, value] = varDecl.trim().split(':').map((s) => s.trim());
                    varBlock.append(postcss.decl({
                        prop: prop,
                        value: value.replace(/;$/, ''),
                    }));
                });

                root.prepend(varBlock);
            }
        }

        // 4. @keyframes 애니메이션 추출
        const keyframesToKeep: postcss.AtRule[] = [];

        root.walkAtRules('keyframes', (keyframeRule) => {
            const animationName = keyframeRule.params;

            if (usedAnimations.has(animationName)) {
                keyframesToKeep.push(keyframeRule.clone());
            }

            // 일단 모든 키프레임 제거
            keyframeRule.remove();
        });

        // 사용된 키프레임만 다시 추가
        keyframesToKeep.forEach((keyframe) => {
            root.append(keyframe);
        });

        // 5. @font-face는 제거 (나중에 추적 기능 추가 가능)
        root.walkAtRules('font-face', (atrule) => {
            atrule.remove();
        });

        return root.toString();
    } catch (error) {
        // CSS 파싱 실패 시 에러 로깅 및 원본 반환
        console.error('CSS 파싱 중 오류 발생:', error);
        return `/* CSS 파싱 오류 발생: ${error instanceof Error ? error.message : 'Unknown error'} */\n${cssString}`;
    }
}

/**
 * 정규식에서 특수 문자를 이스케이프 처리합니다.
 *
 * @param string - 이스케이프할 문자열
 * @returns 이스케이프된 문자열
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
