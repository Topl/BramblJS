require('dotenv').config();
const BramblJS = require('../index');
const assert = require('assert');

const brambljs = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'password',
        //keyPath: './keystore/itGuy.json'
    },
});

describe('KeyManager', () => {
    it('should show the keymanager', function (done) {
        h = brambljs.keyManager.getKeyStorage();
        if (h) {
            assert.equal(typeof h, 'object');
            done();
        } else {
            assert.equal(typeof ver, 'boolean');
            done();
        }
    });
    it('Show array', function (done) {
        h = brambljs.keyManager.getKeyStorage();
        sig = brambljs.keyManager.sign('this is a msg', Buffer.from);

        if (sig) {
            assert.equal(typeof sig, 'object');
            done();
        } else {
            assert.equal(typeof ver, 'boolean');
            done();
        }
    });
    it('Verify the Public Key', function (done) {
        h = brambljs.keyManager.getKeyStorage();
        sig = brambljs.keyManager.sign('this is a msg', Buffer.from);
        ver = brambljs.keyMan.verify(h.publicKeyId, 'this is a msg', sig);

        if (ver) {
            assert.equal(typeof ver, 'boolean');
            done();
        } else {
            assert.equal(typeof ver, 'boolean');
            done();
        }
    });
    it('Import from keystore', function (done) {
        let outKey = '';
        try {
            outKey = brambljs.keyManager.exportToFile('keystore/');
        } catch (err) {
            console.log(err);
        }

        // /////////////////////////
        try {
            const gjam = new BramblJS({
                Requests: {
                    url: 'https://valhalla.torus.topl.co/',
                    apiKey: process.env.VALHALLA_KEY,
                },
                KeyManager: {
                    password: 'password',
                    keyPath: outKey,
                },
            });
            assert.equal(typeof gjam.keyManager.getKeyStorage().publicKeyId, 'string');

            done();
        } catch (err) {
            console.log(err);
        }
    });
});
