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
        // 파싱 실패 시 안전하게 빈 문자열 반환 (전역 오염 방지)
        // 사용자에게 에러 메시지 표시
        return `/* ⚠️ CSS 파싱 오류: 스타일을 적용할 수 없습니다.\n오류 내용: ${error instanceof Error ? error.message : 'Unknown error'}\n\n원본 CSS는 보안상 렌더링되지 않았습니다. */`;
    }
};
