import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import UiControl from './UiControl';
import { scopeCSS } from '../utils/scopeCss';

import styles from './Render.module.css';
import getDecodedValue from '../utils/getDecodedValue';

import { tutorialCss } from '../constants/tutorialCss';
import { tutorialHtml } from '../constants/tutorialHtml';
const Render = ({ isEdit }: { isEdit: boolean }) => {
    const [searchParams] = useSearchParams();

    const tutorial = searchParams.get('html') === 'tutorial';

    const bg = searchParams.get('bg') || '#ffffff';
    const html = tutorial ? tutorialHtml : getDecodedValue(searchParams.get('html') || '');
    const css = tutorial ? tutorialCss : getDecodedValue(searchParams.get('css') || '');

    const [selectTag, setSelectTag] = useState<HTMLElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    const onClickElement = (e: MouseEvent) => {
        const { id, classList } = e.target as HTMLElement;

        if (e.target && ref.current?.contains(e.target as Node) && classList[0] === 'view-lines') {
            return;
        } else if (
            (e.target && !ref.current?.contains(e.target as Node)) ||
            e.target === ref.current ||
            // placeholder 엘리먼트 제외
            id === '_656d707479' ||
            id === 'preview_wrap__x9zq8_vn3l0'
        ) {
            setSelectTag(null);
            return;
        }
        setSelectTag(e.target as HTMLElement);
    };

    const getSelector = (element: HTMLElement) => {
        const selector = element.id
            ? `#${element.id}`
            : element.className
              ? `.${element.className.split(' ').join('.')}`
              : element.tagName;
        return selector;
    };

    const highlightModeMouseover = (e: MouseEvent) => {
        const element = e.target as HTMLElement;
        if (element.id === '_656d707479') return;

        const selector = getSelector(element);
        if (ref.current) {
            ref.current.querySelectorAll(selector).forEach((el) => {
                el.classList.add('highlight-for-mode');
            });
        }
    };

    const highlightModeMouseout = (e: MouseEvent) => {
        const element = e.target as HTMLElement;
        const selector = getSelector(element);

        if (ref.current) {
            ref.current.querySelectorAll(selector).forEach((el) => {
                el.classList.remove('highlight-for-mode');
            });
        }
    };

    useEffect(() => {
        const element = ref.current;
        if (!element || !isEdit) {
            setSelectTag(null);
            return;
        }

        document.addEventListener('click', onClickElement);
        element.addEventListener('mouseover', highlightModeMouseover);
        element.addEventListener('mouseout', highlightModeMouseout);

        return () => {
            document.removeEventListener('click', onClickElement);
            element.removeEventListener('mouseover', highlightModeMouseover);
            element.removeEventListener('mouseout', highlightModeMouseout);
        };
    }, [isEdit]);

    return (
        <>
            <div className={styles.renderer} ref={ref}>
                <div
                    className={styles.con}
                    id={`preview_wrap__x9zq8_vn3l0`}
                    style={{ backgroundColor: bg }}
                    dangerouslySetInnerHTML={{
                        __html: `${html || '<div id="_656d707479">HTML을 입력해주세요.</div>'}`,
                    }}
                />
                <style>
                    {`#preview_wrap__x9zq8_vn3l0 #_656d707479 {
                            all : unset;
                            color : var(--muted);
                            font-size : 36px;
                            text-shadow: 0 0 2px rgba(0,0,0,0.5);
                            mix-blend-mode: difference; 
                        }
              
                        #preview_wrap__x9zq8_vn3l0 .highlight-for-mode  {
                            position: relative; 
                           
                        }
                            
                        #preview_wrap__x9zq8_vn3l0 .highlight-for-mode::after {
                            content: '';
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            border: 3px dotted black;
                            pointer-events: none; 
                            box-sizing: border-box;
                        }
    
                        ${scopeCSS(css, '#preview_wrap__x9zq8_vn3l0') || ''}`}
                </style>
                <UiControl selectTag={selectTag} enable={selectTag && isEdit} />
            </div>
        </>
    );
};

export default React.memo(Render);
