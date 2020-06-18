import Base58 from 'base-58';

/**
 * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
 * will be used if the input is valid hex.  If the input is valid base64 but
 * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
 * @param {string | Buffer} str String to be converted.
 * @param {string=} enc Encoding of the input string (optional).
 * @return {Buffer} Buffer (bytearray) containing the input data.
 */
function str2buf(str: string | Buffer | Uint8Array, enc?: 'utf8' | 'hex' | 'base64' | 'base58'): Buffer;

function str2buf(str: any, enc?: string): Buffer | undefined {
    switch (str.constructor) {
        case Buffer:
            return isBuffer(str);
        case Uint8Array:
            return isUint(str);
        case String:
            return isStr(str, enc);
        default:
            throw new Error('Input type is not one of ["string", "Buffer", "Uint8Array"]');
    }
}

function isBuffer(str: Buffer): Buffer {
    return str;
}

function isUint(str: Uint8Array): Buffer {
    return Buffer.from(str);
}

function isStr(str: string, enc?: string): Buffer {
    switch (enc) {
        case 'utf8':
        case 'hex':
        case 'base64':
            return Buffer.from(str, enc);

        case 'base58':
        default:
            return Buffer.from(Base58.decode(str));
    }
}

export default str2buf;
