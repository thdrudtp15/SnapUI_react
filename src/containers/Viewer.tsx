import { useState } from 'react';

import ActionPanel from '../components/ActionPanel';
import BgColorPicker from '../components/BgColorPicker';
import Render from '../components/Render';

import { LuMousePointerClick } from 'react-icons/lu';

import styles from './Viewer.module.css';

const Viewer = () => {
    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className={styles.viewer_container}>
            <ActionPanel>
                <button
                    className={`${styles.nav_item} ${isEdit ? styles['edit_on'] : null}`}
                    onClick={() => setIsEdit((prev: boolean) => !prev)}
                >
                    <LuMousePointerClick fontSize={24} />
                    Highlight Styles
                </button>
                <BgColorPicker />
            </ActionPanel>
            <Render isEdit={isEdit} />
        </div>
    );
};

export default Viewer;

// 스타일 태그 내의 css가 모든 태그에 영향을 미치는 문제 수정
//
