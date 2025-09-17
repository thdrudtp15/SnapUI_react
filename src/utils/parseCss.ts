export type CSSObject = Record<string, Record<string, string>>;

/**
 * CSS 문자열을 { selector: { prop: value } } 형태로 변환
 */
export const parseCSS = (cssText: string): CSSObject => {
    const result: CSSObject = {};

    // 정규식으로 각 rule 추출
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = ruleRegex.exec(cssText)) !== null) {
        const selector = match[1].trim();
        const body = match[2].trim();

        if (!result[selector]) result[selector] = {};

        // body를 ; 기준으로 쪼개고 property/value 매핑
        body.split(';').forEach((line) => {
            const [prop, value] = line.split(':').map((s) => s.trim());
            if (prop && value) {
                result[selector][prop] = value;
            }
        });
    }

    return result;
};
