import postcss from 'postcss';

/**
 * 렌더링 컴포넌트에서 스타일이 전역으로 설정되는 것을 방지하기 위해 CSS에 스코프를 추가하는 함수
 * @keyframes, @media 등의 at-rule을 올바르게 처리합니다.
 */
export const scopeCSS = (css: string, scopeSelector = '.preview') => {
    if (!css || !css.trim()) return css;

    try {
        const root = postcss.parse(css);

        // 최상위 규칙만 스코프 추가
        root.walkRules((rule) => {
            // @keyframes, @font-face 내부 규칙은 건너뛰기
            if (rule.parent?.type === 'atrule') {
                const atRule = rule.parent as postcss.AtRule;
                if (
                    atRule.name === 'keyframes' ||
                    atRule.name === 'font-face' ||
                    atRule.name === '-webkit-keyframes' ||
                    atRule.name === '-moz-keyframes'
                ) {
                    return; // 스코프 추가 안함
                }
            }

            // 선택자에 스코프 추가
            const selectors = rule.selector.split(',').map((sel) => sel.trim());
            const scopedSelectors = selectors.map((sel) => {
                // 이미 스코프가 있으면 건너뛰기
                if (sel.startsWith(scopeSelector)) {
                    return sel;
                }
                return `${scopeSelector} ${sel}`;
            });

            rule.selector = scopedSelectors.join(', ');
        });

        return root.toString();
    } catch (error) {
        console.error('scopeCSS 파싱 오류:', error);
        // 파싱 실패 시 원본 반환
        return css;
    }
};
