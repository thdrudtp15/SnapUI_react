import postcss from 'postcss';

/**
 * 렌더링 컴포넌트에서 스타일이 전역으로 설정되는 것을 방지하기 위해 CSS에 스코프를 추가하는 함수
 *
 * 예시:
 * 입력: .button { color: red; }
 * 출력: .preview .button { color: red; }
 *
 * 이렇게 하면 .preview 안에 있는 요소들만 스타일이 적용됨
 *
 * @keyframes, @media 등의 at-rule을 올바르게 처리합니다.
 */
export const scopeCSS = (css: string, scopeSelector = '.preview') => {
    // 빈 문자열이나 공백만 있으면 그대로 반환
    if (!css || !css.trim()) return css;

    try {
        // PostCSS로 CSS 문자열을 AST(추상 구문 트리)로 파싱
        // AST는 CSS를 트리 구조로 표현한 것 (선택자, 속성, 값 등을 객체로 관리)
        const root = postcss.parse(css);

        // AST를 순회하면서 모든 CSS 규칙(rule)을 찾음
        // rule은 "선택자 { 속성: 값; }" 형태의 CSS 규칙
        root.walkRules((rule) => {
            // 현재 규칙의 부모가 at-rule인지 확인
            // at-rule은 @로 시작하는 CSS 규칙 (@keyframes, @media, @font-face 등)
            if (rule.parent?.type === 'atrule') {
                const atRule = rule.parent as postcss.AtRule;

                // @keyframes 내부 규칙은 스코프를 추가하면 안 됨
                // 이유: @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                //      여기서 0%, 100%는 선택자가 아니라 키프레임 단계이므로 스코프 불가
                // @font-face도 마찬가지로 폰트 정의이므로 선택자 개념이 없음
                if (
                    atRule.name === 'keyframes' ||
                    atRule.name === 'font-face' ||
                    atRule.name === '-webkit-keyframes' || // 크롬/사파리 벤더 프리픽스
                    atRule.name === '-moz-keyframes' // 파이어폭스 벤더 프리픽스
                ) {
                    return; // 이 규칙은 건너뛰고 다음으로
                }
            }

            // 선택자에 스코프 추가 작업 시작
            // CSS 선택자는 쉼표(,)로 여러 개를 나열할 수 있음
            // 예: ".button, .link { color: red; }"
            const selectors = rule.selector.split(',').map((sel) => sel.trim());

            // 각 선택자마다 스코프 셀렉터를 앞에 붙임
            const scopedSelectors = selectors.map((sel) => {
                // 이미 스코프가 붙어있으면 중복 방지
                // 예: ".preview .button"이 이미 있으면 ".preview .preview .button" 안 되게
                if (sel.startsWith(scopeSelector)) {
                    return sel;
                }

                // 스코프 추가: ".button" → ".preview .button"
                // 이렇게 하면 .preview 하위 요소에만 스타일 적용됨 (후손 선택자)
                return `${scopeSelector} ${sel}`;
            });

            // 수정된 선택자들을 다시 쉼표로 합쳐서 규칙에 적용
            // 예: ".preview .button, .preview .link"
            rule.selector = scopedSelectors.join(', ');
        });

        // 수정된 AST를 다시 CSS 문자열로 변환해서 반환
        return root.toString();
    } catch (error) {
        // CSS 파싱 중 에러 발생 시 (문법 오류 등)
        console.error('scopeCSS 파싱 오류:', error);

        // 파싱 실패한 CSS를 그대로 렌더링하면 전역 스타일 오염 위험이 있음
        // 따라서 에러 메시지만 CSS 주석으로 반환 (실제 스타일은 적용 안 됨)
        // 이렇게 하면 사용자는 에러를 볼 수 있지만, 페이지 전체가 망가지진 않음
        return `/* ⚠️ CSS 파싱 오류: 스타일을 적용할 수 없습니다.
오류 내용: ${error instanceof Error ? error.message : 'Unknown error'}

원본 CSS는 보안상 렌더링되지 않았습니다. */`;
    }
};
