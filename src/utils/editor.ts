import { formatHtml, formatCss } from './format';

// 에디터 포메팅 함수
export const format = async (editor: any, lang: 'css' | 'html') => {
    const code = editor.getValue();
    const result = lang === 'html' ? await formatHtml(code) : await formatCss(code);
    editor.setValue(result);
};
