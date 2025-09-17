import { useState } from 'react';

import { FaLink } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

const Copy = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // 1.5초 후 원래 상태
        } catch (err) {
            console.error('복사 실패:', err);
        }
    };

    return (
        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleCopy}>
            {copied ? <FaCheck color="#5bf265" fontSize={16} /> : <FaLink color="white" fontSize={16} />}
        </button>
    );
};

export default Copy;
