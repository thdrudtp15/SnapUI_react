export function extractCSSRules(cssString: string, selectors: string[]) {
    const regex = /([.#]?[a-zA-Z0-9_():\-]+(?:\s*,\s*[.#]?[a-zA-Z0-9_():\-]+)*)\s*\{([\s\S]*?)\}/g;

    return cssString?.replace(regex, (match, selector) => {
        // 주석 블록은 그대로 반환
        if (/^\/\*[\s\S]*\*\/$/.test(match.trim())) {
            return match;
        }

        const selList = selector.split(',').map((s: string) => s.trim());
        const keep = selList.some((s: string) => {
            // pseudo-class(:hover, :active 등) 제거 후 기본 클래스/아이디로 비교
            const base = s.split(':')[0];
            return selectors.includes(base);
        });

        return keep ? match : `/* ${match} */`;
    });
}
