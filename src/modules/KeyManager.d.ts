export interface paramsCreate {
    keyBytes: number;
    ivBytes: number;
}

export interface ConstructorParams {
    password: string;
    constants: KeyEncryptOptions;
    keyPath: string;
}

export interface KeyCrypto {
    kdfSalt: string;
    kdsfSalt: string;
    cipherText: string;
    mac: string;
    cipher: string;
    cipherParams: {
        iv: string;
    };
}

export interface KeyStorage {
    crypto: Crypto;
}

export interface DeriveKey {
    publicKeyId: any;
    crypto: Crypto;
}

export interface KeyPair {
    publicKey: Buffer;
    privateKey: Buffer;
}

export interface KeyObject extends KeyPair {
    iv: Buffer;
    salt: Buffer;
}

export interface KeyStorage {
    publicKeyId: string;
    crypto: KeyCrypto;
}

export interface KeyEncryptOptions {
    cipher: string;
    ivBytes: number;
    keyBytes: number;
    scrypt: KdfParams;
    kdfParams?: KdfParams;
}

export interface KdfParams {
    n: number;
    r: number;
    p: number;
    dkLen: number;
}
