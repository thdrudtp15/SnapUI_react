import type { ReactNode } from 'react';
import styles from './ActionPanel.module.css';

const ActionPanel = ({ children }: { children: ReactNode }) => {
    return <nav className={styles.action_panel}>{children}</nav>;
};

export default ActionPanel;

const Button = ({
    children,
    handleClick,
    select,
}: {
    children: ReactNode;
    handleClick: () => void;
    select: boolean;
}) => {
    return (
        <button className={`${styles.panel_button} ${select ? styles.select : ''}`} onClick={handleClick}>
            {children}
        </button>
    );
};

ActionPanel.Button = Button;
