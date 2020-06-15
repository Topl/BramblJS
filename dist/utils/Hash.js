'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
('use strict');
// Dependencies
const base_58_1 = __importDefault(require('base-58'));
const blake2_1 = __importDefault(require('blake2'));
const fs_1 = __importDefault(require('fs'));
// Based on JCS spec
// https://tools.ietf.org/html/draft-rundgren-json-canonicalization-scheme-17
const canonicalize_1 = __importDefault(require('canonicalize'));
/**
 * standard FastCryptographicHash in Bifrost
 * @returns Initialized hash function
 */
function hashFunc() {
    return blake2_1.default.createHash('blake2b', { digestLength: 32 });
}
/**
 * Create hash digest and encode
 *
 * @param {object} hash Hash object
 * @param {string} [encoding] Desired output encoding. May be one of `hex`, `base64`, or `base58`. If none provided a `Buffer` is returned
 * @returns Blake2b-256 hash digest
 */
function digestAndEncode(hash, encoding) {
    hash.end();
    switch (encoding) {
        case 'hex':
        case 'base64':
            return hash.read().toString(encoding);
        case 'base58':
            return base_58_1.default.encode(hash.read());
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
     * @param {any} message input message to create the hash digest of
     * @param {string} encoding output encoding
     * @returns Blake2b-256 hash digest
     */
    static any(message, encoding) {
        const msg = Buffer.from(canonicalize_1.default(message));
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
    static string(message, encoding) {
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
    static file(filePath, encoding) {
        return new Promise((resolve, reject) =>
            fs_1.default
                .createReadStream(filePath)
                .on('error', reject)
                .pipe(hashFunc())
                .once('finish', function () {
                    resolve(digestAndEncode(this, encoding));
                }),
        );
    }
}
exports.default = Hash;
