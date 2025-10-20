'use client';
import Editor from '@monaco-editor/react';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

import getDecodedValue from '../utils/getDecodedValue';
import { extractCSSRules } from '../utils/extractCssRules';
import { uncommentCss } from '../utils/uncommentCss';
import useUpdateQeryParams from '../hooks/useUpdateQueryParams';
import { format } from '../utils/editor';
import { DEBOUNCE_DELAY } from '../constants/config';

import styles from './UiControl.module.css';

const UiControl = ({ selectTag, enable }: { selectTag: HTMLElement | null; enable: boolean | null }) => {
    const [value, setValue] = useState('');
    const [extractCss, setExtractCss] = useState<string>('');
    const [searchParams] = useSearchParams();

    const { update } = useUpdateQeryParams();
    const css = getDecodedValue(searchParams.get('css'));

    const handleMount = (editor: any, monaco: any) => {
        // Ctrl/Cmd + S → Prettier 포맷

        // 브라우저 기본 동작 막기
        editor.onKeyDown((e: any) => {
            if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyS) {
                format(editor, 'css');
                e.preventDefault(); // 브라우저 저장 막기
            }
        });
    };

    useEffect(() => {
        if (!selectTag) {
            return;
        }
        const tagName = selectTag.tagName;
        const classList = Array.from(selectTag.classList);
        const id = selectTag.id;
        const findProperty = () => {
            const result = extractCSSRules(css, [
                tagName.toLowerCase(),
                ...classList.map((item) => `.${item}`),
                `#${id}`,
            ]);
            setExtractCss(result);
        };
        findProperty();
    }, [selectTag]);

    useEffect(() => {
        const STO = setTimeout(() => {
            update({ key: 'css', value: uncommentCss(value) });
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(STO);
        };
    }, [value]);

    return (
        <aside id="ui-controller" className={`${styles.controller} ${enable ? styles.enable : null}`}>
            {/* {selectTag && <Editors content={extractCss} highlight="css" />} */}
            <Editor
                className="_ui-controller_35zg45_34"
                language="css"
                theme="vs-dark"
                height={`calc(100vh - 107.38px)`}
                value={extractCss}
                onChange={(e) => setValue(e || '')}
                onMount={handleMount}
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                }}
            />
        </aside>
    );
};

export default UiControl;
