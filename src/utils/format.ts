import { format } from 'prettier';
import * as parserHtml from 'prettier/parser-html'; // 예시로 HTML 파서
import * as parserCss from 'prettier/parser-postcss'; // 예시로 CSS 파서

export const formatHtml = async (html: string) => {
    if (!html) return '';

    try {
        return format(html, {
            parser: 'html',
            plugins: [parserHtml],
            printWidth: 30,
            tabWidth: 2,
            useTabs: false,
        });
    } catch (e) {
        console.warn('HTML 포맷 실패:', e);
        return html;
    }
};

export const formatCss = async (css: string) => {
    if (!css) return;

    try {
        const result = await format(css, {
            parser: 'css',
            plugins: [parserCss],
            printWidth: 30,
            useTabs: false,
            // htmlWhitespaceSensitivity: 'ignore',
        });
        return result;
    } catch (e) {
        console.warn('CSS 포멧', e);
        return css;
    }
};
