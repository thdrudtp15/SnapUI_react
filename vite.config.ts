import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Monaco Editor 관련 파일들을 세분화하여 분리
                    if (id.includes('monaco-editor')) {
                        // Workers를 별도 청크로
                        if (id.includes('editor.worker')) return 'monaco-worker-editor';
                        if (id.includes('json.worker')) return 'monaco-worker-json';
                        if (id.includes('css.worker')) return 'monaco-worker-css';
                        if (id.includes('html.worker')) return 'monaco-worker-html';
                        if (id.includes('ts.worker')) return 'monaco-worker-ts';

                        // 언어별 기능을 별도 청크로
                        if (id.includes('/esm/vs/language/')) return 'monaco-languages';
                        if (id.includes('/esm/vs/basic-languages/')) return 'monaco-basic-langs';

                        // 나머지 Monaco 코어
                        return 'monaco-core';
                    }

                    // @monaco-editor/react wrapper
                    if (id.includes('@monaco-editor/react')) {
                        return 'monaco-react';
                    }

                    // React 관련
                    if (
                        id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/') ||
                        id.includes('node_modules/react-router')
                    ) {
                        return 'react-vendor';
                    }

                    // 유틸리티 라이브러리들
                    if (
                        id.includes('node_modules/lz-string') ||
                        id.includes('node_modules/dompurify') ||
                        id.includes('node_modules/react-colorful') ||
                        id.includes('node_modules/prettier')
                    ) {
                        return 'utils';
                    }

                    // react-icons는 별도로 (많은 아이콘 포함)
                    if (id.includes('node_modules/react-icons')) {
                        return 'icons';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
});
