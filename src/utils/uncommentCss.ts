export function uncommentCss(cssString: string) {
    return cssString.replace(
        /\/\*\s*EXTRACTED-CSS-START\s*([\s\S]*?)\s*EXTRACTED-CSS-END\s*\*\//g,
        (_, inner) => '\n' + inner + '\n'
    );
}
