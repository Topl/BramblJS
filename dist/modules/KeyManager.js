'use strict';
/**
 * Create, import, and export Topl Bifrost keys.
 * Also allows for signing of transactions
 * @author James Aman (j.aman@topl.me)
 *
 * Based on the keythereum library from Jack Peterson
 * https://github.com/Ethereumjs/keythereum
 */
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k];
                  },
              });
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __classPrivateFieldSet =
    (this && this.__classPrivateFieldSet) ||
    function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to set private field on non-instance');
        }
        privateMap.set(receiver, value);
        return value;
    };
var __classPrivateFieldGet =
    (this && this.__classPrivateFieldGet) ||
    function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to get private field on non-instance');
        }
        return privateMap.get(receiver);
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
var _sk, _isLocked, _password, _keyStorage;
('use strict');
// Dependencies
const fs_1 = __importDefault(require('fs'));
const path_1 = __importDefault(require('path'));
const blake2_1 = __importDefault(require('blake2'));
const crypto_1 = __importDefault(require('crypto'));
const base_58_1 = __importDefault(require('base-58'));
const keccak_1 = __importDefault(require('keccak'));
const curve25519 = __importStar(require('curve25519-js'));
// Default options for key generation as of 2020.01.25
const defaultOptions = {
    // Symmetric cipher for private key encryption
    //--- anything from crypto.getCiphers() is eligible
    cipher: 'aes-256-ctr',
    // Initialization vector size in bytes
    ivBytes: 16,
    // Private key size in bytes
    keyBytes: 32,
    // Key derivation function parameters
    scrypt: {
        dkLen: 32,
        n: Math.pow(2, 18),
        r: 8,
        p: 1,
    },
};
//// Generic key methods //////////////////////////////////////////////////////////////////////////////////////////////
// function for checking the type input as a callback
function isFunction(f) {
    return typeof f === 'function';
}
/**
 * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
 * will be used if the input is valid hex.  If the input is valid base64 but
 * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
 * @param {string} str String to be converted.
 * @param {string=} enc Encoding of the input string (optional).
 * @return {Buffer} Buffer (bytearray) containing the input data.
 */
function str2buf(str, enc) {
    if (Buffer.isBuffer(str)) {
        return str;
    }
    return enc ? Buffer.from(str, enc) : Buffer.from(base_58_1.default.decode(str));
}
/**
 * Check if the selected cipher is available.
 * @param {string} algo Encryption algorithm.
 * @return {boolean} If available true, otherwise false.
 */
function isCipherAvailable(cipher) {
    return crypto_1.default.getCiphers().some((name) => {
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
function encrypt(plaintext, key, iv, algo) {
    if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');
    const cipher = crypto_1.default.createCipheriv(algo, str2buf(key), iv);
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
function decrypt(ciphertext, key, iv, algo) {
    if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');
    const decipher = crypto_1.default.createDecipheriv(algo, str2buf(key), iv);
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
function getMAC(derivedKey, ciphertext) {
    const keccak256 = (msg) => keccak_1.default('keccak256').update(msg).digest();
    return keccak256(Buffer.concat([str2buf(derivedKey).slice(16, 32), str2buf(ciphertext)]));
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
function create(params, cb) {
    const keyBytes = params.keyBytes;
    const ivBytes = params.ivBytes;
    function bifrostBlake2b(Buffer) {
        return blake2_1.default.createHash('blake2b', { digestLength: 32 }).update(Buffer).digest();
    }
    function curve25519KeyGen(randomBytes) {
        const { public: pk, private: sk1 } = curve25519.generateKeyPair(bifrostBlake2b(randomBytes));
        return {
            publicKey: Buffer.from(pk),
            privateKey: Buffer.from(sk1),
            iv: bifrostBlake2b(crypto_1.default.randomBytes(keyBytes + ivBytes + keyBytes)).slice(0, ivBytes),
            salt: bifrostBlake2b(crypto_1.default.randomBytes(keyBytes + ivBytes)),
        };
    }
    // synchronous key generation if callback not provided
    if (cb) {
        if (isFunction(cb)) {
            crypto_1.default.randomBytes(keyBytes + ivBytes + keyBytes, function (randomBytes) {
                cb(curve25519KeyGen(randomBytes));
            });
        } else {
            return curve25519KeyGen(crypto_1.default.randomBytes(keyBytes + ivBytes + keyBytes));
        }
    } else {
        return curve25519KeyGen(crypto_1.default.randomBytes(keyBytes + ivBytes + keyBytes));
    }
}
/**
 * Derive secret key from password with key derivation function.
 * @param {String|Buffer} password User-supplied password.
 * @param {String|Buffer} salt Randomly generated salt.
 * @param {Object} [kdfParams] key-derivation parameters
 * @param {function} [cb] Callback function (optional).
 * @return {Buffer} Secret key derived from password.
 */
function deriveKey(password, salt, kdfParams, cb) {
    if (typeof password === 'undefined' || password === null || !salt) {
        throw new Error('Must provide password and salt to derive a key');
    }
    // convert strings to Buffers
    // get scrypt parameters
    const dkLen = kdfParams.dkLen;
    const N = kdfParams.n;
    const r = kdfParams.r;
    const p = kdfParams.p;
    const maxmem = 2 * 128 * N * r;
    // use scrypt as key derivation function
    if (cb) {
        if (!isFunction(cb)) {
            return crypto_1.default.scryptSync(str2buf(password, 'utf8'), str2buf(salt), dkLen, {
                N,
                r,
                p,
                maxmem,
            });
        }
        if (cb === undefined) {
            // asynchronous key generation
            return crypto_1.default.scryptSync(str2buf(password, 'utf8'), str2buf(salt), dkLen, {
                N,
                r,
                p,
                maxmem,
            });
        } else {
            cb(
                crypto_1.default.scryptSync(str2buf(password, 'utf8'), str2buf(salt), dkLen, {
                    N,
                    r,
                    p,
                    maxmem,
                }),
            );
        }
    }
}
function deriveKey2(password, salt, kdfParams) {
    if (typeof password === 'undefined' || password === null || !salt) {
        throw new Error('Must provide password and salt to derive a key');
    }
    // convert strings to Buffers
    // get scrypt parameters
    const dkLen = kdfParams.dkLen;
    const N = kdfParams.n;
    const r = kdfParams.r;
    const p = kdfParams.p;
    const maxmem = 2 * 128 * N * r;
    // use scrypt as key derivation function
    return crypto_1.default.scryptSync(str2buf(password, 'utf8'), str2buf(salt), dkLen, {
        N,
        r,
        p,
        maxmem,
    });
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
function marshal(derivedKey, keyObject, salt, iv, algo) {
    // encrypt using last 16 bytes of derived key (this matches Bifrost)
    const ciphertext = encrypt(keyObject.privateKey, derivedKey, iv, algo);
    const keyStorage = {
        publicKeyId: base_58_1.default.encode(keyObject.publicKey),
        crypto: {
            cipher: algo,
            cipherText: base_58_1.default.encode(ciphertext),
            cipherParams: { iv: base_58_1.default.encode(iv) },
            mac: base_58_1.default.encode(getMAC(derivedKey, ciphertext)),
            kdf: 'scrypt',
            kdsfSalt: base_58_1.default.encode(salt),
        },
    };
    return keyStorage;
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
function dump(password, keyObject, options, cb) {
    const kdfParams = options.kdfParams || options.scrypt;
    const salt = keyObject.salt;
    const privateKey = keyObject.privateKey;
    const publicKey = keyObject.publicKey;
    const iv = keyObject.iv;
    // synchronous if no callback provided
    const key = deriveKey2(password, salt, kdfParams);
    if (cb) {
        if (!isFunction(cb) && key !== undefined) {
            return marshal(key, { privateKey, publicKey }, salt, iv, options.cipher);
        }
        // asynchronous if callback provided
        deriveKey(
            password,
            salt,
            kdfParams,
            function (derivedKey) {
                if (cb !== undefined) {
                    cb(marshal(derivedKey, { privateKey, publicKey }, salt, iv, options.cipher));
                }
            }.bind(this),
        );
    } else {
        return marshal(key, { privateKey, publicKey }, salt, iv, options.cipher);
    }
}
/**
 * Recover plaintext private key from secret-storage key object.
 * @param {string|Buffer} password User-supplied password.
 * @param {Object} keyStorage Keystore object.
 * @param {Object} [kdfParams] key-derivation parameters
 * @param {function=} cb Callback function (optional).
 * @return {Buffer} Plaintext private key.
 */
function recover(password, keyStorage, kdfParams, cb) {
    // verify that message authentication codes match, then decrypt
    function verifyAndDecrypt(derivedKey, iv, ciphertext, mac, algo) {
        if (!getMAC(derivedKey, ciphertext).equals(mac)) {
            throw new Error('message authentication code mismatch');
        }
        if (!isCipherAvailable(algo)) throw new Error(algo + ' is not available');
        return decrypt(ciphertext, derivedKey, str2buf(iv), algo);
    }
    const iv = str2buf(keyStorage.crypto.cipherParams.iv);
    const salt = str2buf(keyStorage.crypto.kdsfSalt);
    const ciphertext = str2buf(keyStorage.crypto.cipherText);
    const mac = str2buf(keyStorage.crypto.mac);
    const algo = keyStorage.crypto.cipher;
    // derive secret key from password
    if (cb) {
        if (!isFunction(cb)) {
            return verifyAndDecrypt(deriveKey2(password, salt, kdfParams), iv, ciphertext, mac, algo);
        } else {
            deriveKey(password, salt, kdfParams, (derivedKey) => {
                if (cb !== undefined) {
                    cb(verifyAndDecrypt(derivedKey, iv, ciphertext, mac, algo));
                }
            });
        }
    } else {
        return verifyAndDecrypt(deriveKey2(password, salt, kdfParams), iv, ciphertext, mac, algo);
    }
}
/**
 * Generate filename for a keystore file.
 * @param {String} publicKey Topl address.
 * @return {string} Keystore filename.
 */
function generateKeystoreFilename(publicKey) {
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
    //// Instance constructor //////////////////////////////////////////////////////////////////////////////////////////////
    constructor(params) {
        // Private variables
        _sk.set(this, void 0);
        _isLocked.set(this, void 0);
        _password.set(this, void 0);
        _keyStorage.set(this, void 0);
        // enforce that a password must be provided\
        if (!params.password && params.constructor !== String)
            throw new Error('A password must be provided at initialization');
        // Initialize a key manager object with a key storage object
        const initKeyStorage = (keyStorage, password) => {
            this.pk = keyStorage.publicKeyId;
            __classPrivateFieldSet(this, _isLocked, false);
            __classPrivateFieldSet(this, _password, password);
            __classPrivateFieldSet(this, _keyStorage, keyStorage);
            if (this.pk) {
                __classPrivateFieldSet(this, _sk, recover(String(password), keyStorage, this.constants.scrypt));
            }
        };
        const generateKey = (password) => {
            initKeyStorage(dump(password, create(this.constants), this.constants), password);
        };
        // Imports key data object from keystore JSON file.
        const importFromFile = (filepath, password) => {
            const keyStorage = JSON.parse(String(fs_1.default.readFileSync(filepath)));
            // todo - check that the imported object conforms to our definition of a keyfile
            initKeyStorage(keyStorage, password);
        };
        // initialize vatiables
        this.constants = params.constants || defaultOptions;
        initKeyStorage({ publicKeyId: '', crypto: {} }, Buffer.from(''));
        // load in keyfile if a path was given, or default to generating a new key
        if (params.keyPath) {
            try {
                importFromFile(params.keyPath, params.password);
            } catch (err) {
                throw new Error('Error importing keyfile');
            }
        } else {
            // Will check if only a string was given and assume it is the password
            if (params.constructor === String) {
                generateKey(params);
            }
            generateKey(params);
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
    static verify(publicKey, message, signature, cb) {
        const pk = str2buf(publicKey);
        const msg = str2buf(message, 'utf8');
        const sig = signature;
        // synchronous key generation if callback not provided
        if (cb) {
            if (cb !== undefined) {
                cb(curve25519.verify(pk, msg, sig));
            }
        } else {
            return curve25519.verify(pk, msg, sig);
        }
        // asynchronous
    }
    ////////////////// Public methods ////////////////////////////////////////////////////////////////////////
    /**
     * Getter function to retrieve key storage in the Bifrost compatible format
     * @memberof KeyManager
     */
    getKeyStorage() {
        if (__classPrivateFieldGet(this, _isLocked))
            throw new Error('Key manager is currently locked. Please unlock and try again.');
        if (!this.pk) throw new Error('A key must be initialized before using this key manager');
        return __classPrivateFieldGet(this, _keyStorage);
    }
    /**
     * Set the key manager to locked so that the private key may not be decrypted
     * @memberof KeyManager
     */
    lockKey() {
        __classPrivateFieldSet(this, _isLocked, true);
    }
    /**
     * Unlock the key manager to be used in transactions
     * @param {string} password encryption password for accessing the keystorage object
     * @memberof KeyManager
     */
    unlockKey(password) {
        if (!__classPrivateFieldGet(this, _isLocked)) throw new Error('The key is already unlocked');
        if (password !== __classPrivateFieldGet(this, _password)) throw new Error('Invalid password');
        __classPrivateFieldSet(this, _isLocked, false);
    }
    /**
     * Generate the signature of a message using the provided private key
     * @param {string} message Message to sign (utf-8 encoded)
     * @return {Buffer=} signature
     * @memberof KeyManager
     */
    sign(message) {
        if (__classPrivateFieldGet(this, _isLocked)) {
            throw new Error('The key is currently locked. Please unlock and try again.');
        }
        function curve25519sign(privateKey, message) {
            return curve25519.sign(str2buf(privateKey), str2buf(message, 'utf8'), crypto_1.default.randomBytes(64));
        }
        return curve25519sign(__classPrivateFieldGet(this, _sk), message);
    }
    /**
     * Export formatted JSON to keystore file.
     * @param {Object} keyStorage Keystore object.
     * @param {string=} keystore Path to keystore folder (default: "keystore").
     * @return {string} JSON filename
     * @memberof KeyManager
     */
    exportToFile(_keyPath) {
        const keyPath = _keyPath || 'keyfiles';
        const outfile = generateKeystoreFilename(this.pk);
        const json = JSON.stringify(this.getKeyStorage());
        const outpath = path_1.default.join(keyPath, outfile);
        fs_1.default.writeFileSync(outpath, json);
        return outpath;
    }
}
(_sk = new WeakMap()), (_isLocked = new WeakMap()), (_password = new WeakMap()), (_keyStorage = new WeakMap());
module.exports = KeyManager;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
