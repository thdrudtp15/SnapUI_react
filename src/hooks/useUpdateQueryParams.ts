import { useSearchParams } from 'react-router';
import LzString from 'lz-string';

const useUpdateQueryParams = () => {
    const [_, setSearchParams] = useSearchParams();

    // LZString 압축 인코딩
    const update = ({ key, value }: { key: string; value: string }) => {
        const encodedValue = LzString.compressToEncodedURIComponent(value);
        setSearchParams((prev) => ({ ...Object.fromEntries(prev), [key]: encodedValue }));
    };

    return {
        update,
    };
};

export default useUpdateQueryParams;
