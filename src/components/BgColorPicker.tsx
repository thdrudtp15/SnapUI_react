'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './BgColorPicker.module.css';
import { HexColorPicker } from 'react-colorful';
import useOnClickOutside from '../hooks/useClickOutside';
import { useSearchParams } from 'react-router';
import { DEBOUNCE_DELAY } from '../constants/config';

const BgColorPicker = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const ref = useRef(null);

    const tutorial = searchParams.get('html') === 'tutorial';

    const [isEnable, setIsEnable] = useState(false);
    const [bgHex, setBgHex] = useState(tutorial ? '#202020' : searchParams.get('bg') || '#ffffff');

    useOnClickOutside({ ref: ref, onClickOutside: () => setIsEnable(false) });

    useEffect(() => {
        if (!isEnable) return;
        const STO = setTimeout(() => {
            setSearchParams((prev) => ({ ...Object.fromEntries(prev), bg: bgHex }));
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(STO);
    }, [bgHex]);

    return (
        <div className={styles.container} ref={ref}>
            <div className={styles.toggle_wrap}>
                <button type="button" className={styles.toggle} onClick={() => setIsEnable((prev: boolean) => !prev)}>
                    <div className={styles.color} style={{ backgroundColor: bgHex }} />
                </button>
                <span className={styles.hex_text}>{bgHex}</span>
            </div>
            {isEnable && <HexColorPicker className={styles.picker} color={bgHex} onChange={(e) => setBgHex(e)} />}
        </div>
    );
};

export default BgColorPicker;
