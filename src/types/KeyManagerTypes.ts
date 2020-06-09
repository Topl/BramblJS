export interface paramsCreate {
    keyBytes: number;
    ivBytes: number;
}
export interface KdfParams {
    n: number;
    r: number;
    p: number;
    dkLen: number;
}
export interface ConstructorParams {
    password: any;
    constants: any;
    constructor: any;
    keyPath: string;
}
export interface KeyObject {
    publicKey: string;
    privateKey: string;
}
export interface Options {
    kdfParams: KdfParams;
    scrypt: any;
    cipher: string;
}
interface CipherParams {
    iv: any;
}
interface Crypto {
    kdfSalt: string;
    kdsfSalt: string;
    cipherText: string;
    mac: Uint8Array;
    cipher: Buffer;
    cipherParams: CipherParams;
}
export interface KeyStorage {
    crypto: Crypto;
}
