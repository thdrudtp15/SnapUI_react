import LZString from 'lz-string';

const getDecodedValue = (value: string | null) => {
    return LZString.decompressFromEncodedURIComponent(value as string);
};

export default getDecodedValue;
