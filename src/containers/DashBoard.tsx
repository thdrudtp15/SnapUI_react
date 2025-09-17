'use client';
import { useRef, useState } from 'react';

import styles from './DashBoard.module.css';
import SectionControlBar from '../components/SectionControlBar';
import ActionPanel from '../components/ActionPanel.tsx';

import DashBoardEditor from '../components/Editor.tsx';

import { FaHtml5 } from 'react-icons/fa6';
import { FaCss3Alt } from 'react-icons/fa';
import { FaWindows } from 'react-icons/fa6';
import { FaApple } from 'react-icons/fa6';

const DashBoard = () => {
    const [select, setSelect] = useState<'html' | 'css'>('html');

    const dashboard = useRef<HTMLDivElement | null>(null);

    return (
        <div className={styles.dashboard} ref={dashboard} id="dashboard">
            <ActionPanel>
                <ActionPanel.Button handleClick={() => setSelect('html')} select={select === 'html'}>
                    <FaHtml5 fontSize={24} color="#E44D26" />
                    HTML
                </ActionPanel.Button>
                <ActionPanel.Button handleClick={() => setSelect('css')} select={select === 'css'}>
                    <FaCss3Alt fontSize={24} color="#1572B6" />
                    CSS
                </ActionPanel.Button>
            </ActionPanel>
            <div className={styles.editor_wrap}>
                <DashBoardEditor lang={'html'} enable={select === 'html'} />
                <DashBoardEditor lang={'css'} enable={select === 'css'} />
            </div>
            <div className={styles.guide}>
                <span>
                    <FaWindows fontSize={14} /> Ctrl + S 포메팅
                </span>
                <span>
                    <FaApple /> Cmd + S 포메팅
                </span>
            </div>

            <SectionControlBar targetRef={dashboard} />
        </div>
    );
};

export default DashBoard;
