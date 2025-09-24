import postcss from 'postcss';

export function extractCSSRules(cssString: string, selectors: string[]) {
    const root = postcss.parse(cssString);

    root.walkRules((rule) => {
        const selList = rule.selector.split(',').map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').trim());

        const keep = selList.some((s) => {
            const base = s.split(':')[0].trim();
            const first = base.split(/\s+/)[0];
            return selectors.includes(first);
        });

        if (!keep) {
            rule.replaceWith(postcss.comment({ text: `EXTRACTED-CSS-START\n${rule.toString()}\nEXTRACTED-CSS-END` }));
        }
    });

    root.walkAtRules((atrule) => {
        if (atrule.name === 'keyframes' || atrule.name === 'font-face') {
            atrule.remove();
        }
    });

    return root.toString();
}
