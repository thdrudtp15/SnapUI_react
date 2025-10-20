import { Editor } from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import getDecodedValue from '../utils/getDecodedValue';
import useUpdateQeryParams from '../hooks/useUpdateQueryParams';

import { format } from '../utils/editor';
import { DEBOUNCE_DELAY } from '../constants/config';
const DashBoardEditor = ({ lang, enable }: { lang: 'html' | 'css'; enable: boolean }) => {
    const [searchParams] = useSearchParams();
    const [value, setValue] = useState('');
    const { update } = useUpdateQeryParams();

    const editorRef = useRef(null);

    const css = getDecodedValue(searchParams.get('css') || '');
    const html = getDecodedValue(searchParams.get('html') || '');

    const handleMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        // 브라우저 기본 동작 막기
        editor.onKeyDown(async (e: any) => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyS) {
                await format(editor, lang);
                e.preventDefault(); // 브라우저 저장 막기
            }
        });
    };

    useEffect(() => {
        const STO = setTimeout(() => {
            update({ key: lang, value });
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(STO);
    }, [value]);

    useEffect(() => {
        setValue(lang === 'html' ? html : css);
    }, [lang, css, html]);

    return (
        <div style={{ display: enable ? 'block' : 'none', height: '100%', width: '100%' }}>
            <Editor
                language={lang}
                width={'100%'}
                theme="vs-dark"
                height={`calc(100vh - 107.38px)`}
                value={value}
                onChange={(e) => setValue(e || '')}
                onMount={handleMount}
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                }}
            />
        </div>
    );
};

export default React.memo(DashBoardEditor);
