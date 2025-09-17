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
