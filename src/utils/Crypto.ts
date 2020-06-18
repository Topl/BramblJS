import str2buf from '../lib/str2buf';
import * as curve25519 from 'curve25519-js';

class Crypto {
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
    static verify(
        publicKey: Buffer | string,
        message: string | Buffer,
        signature: Buffer | string | Uint8Array,
    ): boolean {
        const pk = str2buf(publicKey, 'base58');
        const msg = str2buf(message, 'utf8');
        const sig = str2buf(signature);

        return curve25519.verify(pk, msg, sig);
    }
}

export default Crypto;
