export function uncommentCss(cssString: string) {
    return cssString.replace(/\/\*\s*([\s\S]*?)\s*\*\//g, (_, inner) => inner.trim());
}
