import LZString from 'lz-string';

// LZString 압축 해제
const getDecodedValue = (value: string | null) => {
    return LZString.decompressFromEncodedURIComponent(value as string);
};

export default getDecodedValue;
