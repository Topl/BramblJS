const assert = require('assert');
const fs = require('fs');
const Brambl = require('../../index');

const brambl = new Brambl('password');

describe('KeyManager', () => {
    it('should show the keymanager', function (done) {
        h = brambl.keyManager.getKeyStorage();
        if (h) {
            assert.equal(typeof h, 'object');
            done();
        } else {
            assert.equal(typeof ver, 'boolean');
            done();
        }
    });

    it('Show array', function (done) {
        h = brambl.keyManager.getKeyStorage();
        sig = brambl.keyManager.sign('this is a msg', Buffer.from);

        if (sig) {
            assert.equal(typeof sig, 'object');
            done();
        } else {
            assert.equal(typeof ver, 'boolean');
            done();
        }
    });

    it('should verify a message signed by the key', function (done) {
        const msg = 'this is a msg';
        const pk = brambl.keyManager.getKeyStorage().publicKeyId;
        const sig = Buffer.from(brambl.keyManager.sign(msg));

        assert.equal(brambl.utils.Crypto.verify(pk, msg, sig), true);
        done();
    });

    it('Import from keystore', function (done) {
        basePath = './test/unit/';
        try {
            // save key to disk
            outKeyPath = brambl.keyManager.exportToFile(basePath);
            // try to read the key from disk and instantiate a new key manager instance
            outKeyMan = Brambl.KeyManager({
                password: 'password',
                keyPath: outKeyPath,
            });

            assert.equal(typeof outKeyMan.getKeyStorage().publicKeyId, 'string');
            done();
        } catch (err) {
            console.log(err);
        }

        // delete key from disk
        fs.unlinkSync(outKeyPath);
    });
});
