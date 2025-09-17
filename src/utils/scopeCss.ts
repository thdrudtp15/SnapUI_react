// 렌더링 컴포넌트에서 스타일이 전역으로 설정되는 것을 방지하기 위해 CSS에 스코프를 추가하는 함수
export const scopeCSS = (css: string, scopeSelector = '.preview') => {
    return css?.replace(/(^|\})\s*([^{]+)/g, (_, brace, selector) => {
        // 각 셀렉터 앞에 scopeSelector 붙이기
        const scopedSelector = selector
            .split(',')
            .map((sel: string) => `${scopeSelector} ${sel.trim()}`)
            .join(', ');
        return `${brace} ${scopedSelector}`;
    });
};
