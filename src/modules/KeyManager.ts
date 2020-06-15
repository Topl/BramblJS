/**
 * Create, import, and export Topl Bifrost keys.
 * Also allows for signing of transactions
 * @author James Aman (j.aman@topl.me)
 *
 * Based on the keythereum library from Jack Peterson
 * https://github.com/Ethereumjs/keythereum
 */

('use strict');

// Dependencies
import fs from 'fs';
import path from 'path';
import blake from 'blake2';
import crypto from 'crypto';
import Base58 from 'base-58';
import keccakHash from 'keccak';
import * as curve25519 from 'curve25519-js';
import * as KeyManTypes from './KeyManager.d';

// Default options for key generation as of 2020.01.25
const defaultOptions: KeyManTypes.KeyEncryptOptions = {
    // Symmetric cipher for private key encryption
    cipher: 'aes-256-ctr',

    // Initialization vector size in bytes
    ivBytes: 16,

    // Private key size in bytes
    keyBytes: 32,

    // Key derivation function parameters
    scrypt: {
        dkLen: 32,
        n: Math.pow(2, 18), // cost (as given in bifrost)
        r: 8, // blocksize
        p: 1, // parallelization
    },
};

//// Generic key methods //////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
 * will be used if the input is valid hex.  If the input is valid base64 but
 * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
 * @param {string | Buffer} str String to be converted.
 * @param {string=} enc Encoding of the input string (optional).
 * @return {Buffer} Buffer (bytearray) containing the input data.
 */
function str2buf(str: string | Buffer, enc?: 'utf8' | 'hex' | 'base64' | 'base58'): Buffer {
    if (Buffer.isBuffer(str)) {
        return str;
    }

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

/**
 * Check if the selected cipher is available.
 * @param {string} algo Encryption algorithm.
 * @return {boolean} If available true, otherwise false.
 */
function isCipherAvailable(cipher: string): boolean {
    return crypto.getCiphers().some((name) => {
        return name === cipher;
    });
}

/**
 * Symmetric private key encryption using secret (derived) key.
 * @param {string} plaintext Data to be encrypted.
 * @param {string} key Secret key.
 * @param {string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @return {Buffer} Encrypted data.
 */
function encrypt(plaintext: string | Buffer, key: string | Buffer, iv: Buffer, algo: string): Buffer {
    if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');

    const cipher = crypto.createCipheriv(algo, str2buf(key), iv);
    const ciphertext = cipher.update(str2buf(plaintext));
    return Buffer.concat([ciphertext, cipher.final()]);
}

/**
 * Symmetric private key decryption using secret (derived) key.
 * @param {string} ciphertext Data to be decrypted.
 * @param {string} key Secret key.
 * @param {string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @return {Buffer} Decrypted data.
 */
function decrypt(ciphertext: string | Buffer, key: string | Buffer, iv: Buffer, algo: string): Buffer {
    if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');

    const decipher = crypto.createDecipheriv(algo, str2buf(key), iv);
    const plaintext = decipher.update(str2buf(ciphertext));
    return Buffer.concat([plaintext, decipher.final()]);
}

/**
 * Calculate message authentication code from secret (derived) key and
 * encrypted text.  The MAC is the keccak-256 hash of the byte array
 * formed by concatenating the second 16 bytes of the derived key with
 * the ciphertext key's contents.
 * @param {Buffer|string} derivedKey Secret key derived from password.
 * @param {Buffer|string} ciphertext Text encrypted with secret key.
 * @return {string} Base58-encoded MAC.
 */
function getMAC(derivedKey: string | Buffer, ciphertext: Buffer | string): string {
    const keccak256 = (msg: string | Buffer) => keccakHash('keccak256').update(msg).digest();
    return Base58.encode(keccak256(Buffer.concat([str2buf(derivedKey).slice(16, 32), str2buf(ciphertext)])));
}

/**
 * Generate random numbers for private key, initialization vector,
 * and salt (for key derivation).
 * @param {Object} params Encryption options.
 * @param {string} params.keyBytes Private key size in bytes.
 * @param {string} params.ivBytes Initialization vector size in bytes.
 * @param {function=} cb Callback function (optional).
 * @return {Object} Keys, IV and salt.
 */
function create(params: KeyManTypes.paramsCreate): KeyManTypes.KeyObject {
    const keyBytes = params.keyBytes;
    const ivBytes = params.ivBytes;

    function bifrostBlake2b(Buffer: Buffer) {
        return blake.createHash('blake2b', { digestLength: 32 }).update(Buffer).digest();
    }

    function curve25519KeyGen(randomBytes: Buffer): KeyManTypes.KeyObject {
        const { public: pk, private: sk } = curve25519.generateKeyPair(bifrostBlake2b(randomBytes));
        return {
            publicKey: Buffer.from(pk),
            privateKey: Buffer.from(sk),
            iv: bifrostBlake2b(crypto.randomBytes(keyBytes + ivBytes + keyBytes)).slice(0, ivBytes),
            salt: bifrostBlake2b(crypto.randomBytes(keyBytes + ivBytes)),
        };
    }

    return curve25519KeyGen(crypto.randomBytes(keyBytes + ivBytes + keyBytes));
}

/**
 * Derive secret key from password with key derivation function.
 * @param {String|Buffer} password User-supplied password.
 * @param {String|Buffer} salt Randomly generated salt.
 * @param {Object} [kdfParams] key-derivation parameters
 * @param {function} [cb] Callback function (optional).
 * @return {Buffer} Secret key derived from password.
 */
function deriveKey(password: string, salt: Buffer | string, kdfParams: KeyManTypes.KdfParams): Buffer {
    if (typeof password === 'undefined' || password === null || !salt) {
        throw new Error('Must provide password and salt to derive a key');
    }

    // get scrypt parameters
    const dkLen = kdfParams.dkLen;
    const N = kdfParams.n;
    const r = kdfParams.r;
    const p = kdfParams.p;
    const maxmem = 2 * 128 * N * r;
    const scryptOpts = {
        N,
        r,
        p,
        maxmem,
    };

    return crypto.scryptSync(str2buf(password, 'utf8'), str2buf(salt), dkLen, scryptOpts);
}

/**
 * Assemble key data object in secret-storage format.
 * @param {Buffer} derivedKey Password-derived secret key.
 * @param {Object} keyObject Object containing the raw public / private keypair
 * @param {Buffer} salt Randomly generated salt.
 * @param {Buffer} iv Initialization vector.
 * @param {Buffer} algo encryption algorithm to be used
 * @return {Object} key data object in secret-storage format
 */
function marshal(
    derivedKey: Buffer,
    keyPair: KeyManTypes.KeyPair,
    salt: Buffer,
    iv: Buffer,
    algo: string,
): KeyManTypes.KeyStorage {
    // encrypt using last 16 bytes of derived key (this matches Bifrost)
    const ciphertext = encrypt(keyPair.privateKey, derivedKey, iv, algo);

    return {
        publicKeyId: Base58.encode(keyPair.publicKey),
        crypto: {
            cipher: algo,
            cipherText: Base58.encode(ciphertext),
            cipherParams: { iv: Base58.encode(iv) },
            mac: getMAC(derivedKey, ciphertext),
            kdf: 'scrypt',
            kdsfSalt: Base58.encode(salt),
        },
    };
}

/**
 * Export private key to keystore secret-storage format.
 * @param {string|Buffer} password User-supplied password.
 * @param {Object} keyObject Object containing the raw public / private keypair
 * @param {Buffer} algo encryption algorithm to be used
 * @param {function=} cb Callback function (optional).
 * @return {Object} keyStorage for use with exportToFile
 */
// =============================================================
// object for keyObject is going to be a pain
function dump(
    password: string,
    keyObject: KeyManTypes.KeyObject,
    options: KeyManTypes.KeyEncryptOptions,
): KeyManTypes.KeyStorage {
    const kdfParams = options.kdfParams || options.scrypt;
    const salt = keyObject.salt;
    const privateKey = keyObject.privateKey;
    const publicKey = keyObject.publicKey;
    const iv = keyObject.iv;
    const key = deriveKey(password, salt, kdfParams);

    return marshal(key, { privateKey, publicKey }, salt, iv, options.cipher);
}

/**
 * Recover plaintext private key from secret-storage key object.
 * @param {string|Buffer} password User-supplied password.
 * @param {Object} keyStorage Keystore object.
 * @param {Object} [kdfParams] key-derivation parameters
 * @param {function=} cb Callback function (optional).
 * @return {Buffer} Plaintext private key.
 */
function recover(password: string, keyStorage: KeyManTypes.KeyStorage, kdfParams: KeyManTypes.KdfParams): Buffer {
    // verify that message authentication codes match, then decrypt
    function verifyAndDecrypt(derivedKey: Buffer, iv: Buffer, ciphertext: Buffer, mac: string, algo: string) {
        if (getMAC(derivedKey, ciphertext) !== mac) {
            throw new Error('message authentication code mismatch');
        }
        if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');

        return decrypt(ciphertext, derivedKey, str2buf(iv), algo);
    }

    const iv = str2buf(keyStorage.crypto.cipherParams.iv);
    const salt = str2buf(keyStorage.crypto.kdsfSalt);
    const ciphertext = str2buf(keyStorage.crypto.cipherText);
    const mac = keyStorage.crypto.mac;
    const algo = keyStorage.crypto.cipher;

    // derive secret key from password
    return verifyAndDecrypt(deriveKey(password, salt, kdfParams), iv, ciphertext, mac, algo);
}

/**
 * Generate filename for a keystore file.
 * @param {String} publicKey Topl address.
 * @return {string} Keystore filename.
 */
function generateKeystoreFilename(publicKey: string): string {
    if (typeof publicKey !== 'string') throw new Error('PublicKey must be given as a string for the filename');
    const filename = new Date().toISOString() + '-' + publicKey + '.json';

    return filename.split(':').join('-');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Key Manager Class //////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @class Create a new instance of the Key management interface.
 * @param {object} params constructor object for key manager
 * @param {string} params.password password for encrypting (decrypting) the keyfile
 * @param {string} [params.path] path to import keyfile
 * @param {object} [params.constants] default encryption options for storing keyfiles
 */
class KeyManager {
    // Private variables
    #sk: Buffer;
    #isLocked: boolean;
    #password: string;
    #keyStorage: KeyManTypes.KeyStorage;
    pk: string;
    constants: KeyManTypes.KeyEncryptOptions;

    //// Instance constructor //////////////////////////////////////////////////////////////////////////////////////////////
    constructor(params: KeyManTypes.ConstructorParams) {
        // enforce that a password must be provided\
        if (!params.password && params.constructor !== String)
            throw new Error('A password must be provided at initialization');

        // Initialize a key manager object with a key storage object
        const initKeyStorage = (keyStorage: KeyManTypes.KeyStorage, password: string) => {
            this.pk = keyStorage.publicKeyId;
            this.#isLocked = false;
            this.#password = password;
            this.#keyStorage = keyStorage;

            if (this.pk) {
                this.#sk = recover(password, keyStorage, this.constants.scrypt);
            }
        };

        // Generate a new key given the encryption password
        const generateKey = (password: string): void => {
            initKeyStorage(dump(password, create(this.constants), this.constants), password);
        };

        // Imports key data object from keystore JSON file.
        const importFromFile = (filepath: string, password: string) => {
            const keyStorage = JSON.parse(String(fs.readFileSync(filepath)));

            // todo - check that the imported object conforms to our definition of a keyfile
            initKeyStorage(keyStorage, password);
        };

        // initialize vatiables
        this.constants = params.constants || defaultOptions;
        initKeyStorage({ publicKeyId: '', crypto: {} }, '');

        // load in keyfile if a path was given, or default to generating a new key
        if (params.keyPath) {
            try {
                importFromFile(params.keyPath, params.password);
            } catch (err) {
                throw new Error('Error importing keyfile');
            }

            // check if only a string was given and assume it is the password
        } else if (params.constructor === String) {
            generateKey(params);

            // finally, try to generate a key from a password provided in the params object
        } else {
            generateKey(params.password);
        }
    }

    //// Static methods //////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Check whether a private key was used to generate the signature for a message.
     * This method is static so that it may be used without generating a keyfile
     * @param {Buffer|string} publicKey A public key (if string, must be base-58 encoded)
     * @param {string} message Message to sign (utf-8 encoded)
     * @param {Buffer|string} signature Signature to verify (if string, must be base-58 encoded)
     * @param {function=} cb Callback function (optional).
     * @return {boolean}
     * @memberof KeyManager
     */
    static verify(publicKey: Buffer | string, message: string | Buffer, signature: Buffer | string): boolean {
        const pk = str2buf(publicKey, 'base58');
        const msg = str2buf(message, 'utf8');
        const sig = str2buf(signature);

        return curve25519.verify(pk, msg, sig);
    }

    ////////////////// Public methods ////////////////////////////////////////////////////////////////////////
    /**
     * Getter function to retrieve key storage in the Bifrost compatible format
     * @memberof KeyManager
     */
    getKeyStorage(): KeyManTypes.KeyStorage {
        if (this.#isLocked) throw new Error('Key manager is currently locked. Please unlock and try again.');
        if (!this.pk) throw new Error('A key must be initialized before using this key manager');
        return this.#keyStorage;
    }

    /**
     * Set the key manager to locked so that the private key may not be decrypted
     * @memberof KeyManager
     */
    lockKey(): void {
        this.#isLocked = true;
    }

    /**
     * Unlock the key manager to be used in transactions
     * @param {string} password encryption password for accessing the keystorage object
     * @memberof KeyManager
     */
    unlockKey(password: string): void {
        if (!this.#isLocked) throw new Error('The key is already unlocked');
        if (password !== this.#password) throw new Error('Invalid password');
        this.#isLocked = false;
    }

    /**
     * Generate the signature of a message using the provided private key
     * @param {string | Buffer} message Message to sign (utf-8 encoded)
     * @return {UInt8Array} signature
     * @memberof KeyManager
     */
    sign(message: string | Buffer): Uint8Array {
        if (this.#isLocked) {
            throw new Error('The key is currently locked. Please unlock and try again.');
        }

        function curve25519sign(privateKey: string | Buffer, message: string | Buffer): Uint8Array {
            return curve25519.sign(str2buf(privateKey), str2buf(message, 'utf8'), crypto.randomBytes(64));
        }

        return curve25519sign(this.#sk, message);
    }

    /**
     * Export formatted JSON to keystore file.
     * @param {string} keyPath Path to keystore folder (default: "keystore").
     * @return {string} JSON filename
     * @memberof KeyManager
     */
    exportToFile(keyPath = 'keyfiles'): string {
        const outfile = generateKeystoreFilename(this.pk);
        const json = JSON.stringify(this.getKeyStorage());
        const outpath = path.join(keyPath, outfile);

        fs.writeFileSync(outpath, json);
        return outpath;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export = KeyManager;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
