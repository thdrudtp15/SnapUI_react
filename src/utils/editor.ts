import { formatHtml, formatCss } from './format';

export const format = async (editor: any, lang: 'css' | 'html') => {
    const code = editor.getValue();
    const result = lang === 'html' ? await formatHtml(code) : await formatCss(code);
    editor.setValue(result);
};
