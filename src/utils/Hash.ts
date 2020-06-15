('use strict');

// Dependencies
import fs from 'fs';
import blake from 'blake2';
import Base58 from 'base-58';
import JSONCanonify from 'canonicalize'; // https://tools.ietf.org/html/draft-rundgren-json-canonicalization-scheme-17

/**
 * standard FastCryptographicHash in Bifrost
 * @returns Initialized hash function
 */
function hashFunc(): blake.Hash {
    return blake.createHash('blake2b', { digestLength: 32 });
}

/**
 * Create hash digest and encode
 *
 * @param {Hash} hash Hash object
 * @param {string} [encoding] Desired output encoding. May be one of `hex`, `base64`, or `base58`. If none provided a `Buffer` is returned
 * @returns Blake2b-256 hash digest
 */
function digestAndEncode(hash: blake.Hash, encoding: string) {
    hash.end();
    switch (encoding) {
        case 'hex':
        case 'base64':
            return hash.read().toString(encoding);

        case 'base58':
            return Base58.encode(hash.read());

        default:
            return hash.read();
    }
}

/**
 * @class Static only class to hash an input message and produce an output that matches the output of Bifrost FastCrytographicHash
 */
class Hash {
    /**
     * Calculates the Blake2b-256 hash of an arbitrary input. This function will apply JSON canonicalization to the given message.
     * Further information regarding JON canonicalization may be found at {@link https://github.com/cyberphone/json-canonicalization}
     *
     * @param {string} message input message to create the hash digest of
     * @param {string} encoding output encoding
     * @returns Blake2b-256 hash digest
     */
    static any(message: Record<string, unknown>, encoding: string): string {
        const msg = Buffer.from(JSONCanonify(message));
        const hash = hashFunc().update(msg);
        return digestAndEncode(hash, encoding);
    }

    /**
     * Calculates the Blake2b-256 of a string input
     *
     * @param {string} message input string message to create the hash digest of
     * @param {string} encoding output encoding
     * @returns Blake2b-256 hash digest
     */
    static string(message: string, encoding: string): string {
        const msg = Buffer.from(message);
        const hash = hashFunc().update(msg);
        return digestAndEncode(hash, encoding);
    }

    /**
     * Reads the file from disk and calculates the Blake2b-256
     *
     * @param {string} filePath path to the input file
     * @param {string} encoding output encoding
     * @returns Blake2b-256 hash digest
     */
    static file(filePath: string, encoding: string): Promise<string> {
        return new Promise((resolve, reject) =>
            fs
                .createReadStream(filePath)
                .on('error', reject)
                .pipe(hashFunc())
                .once('finish', function (this: blake.Hash) {
                    resolve(digestAndEncode(this, encoding));
                }),
        );
    }
}

export default Hash;