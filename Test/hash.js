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

describe('Hash Function', () => {
    it('buffer encoding', (done) => {
        enc = brambljs.utils.Hash.any('test text');
        assert.equal(typeof enc, 'object');
        done();
    });
    it('hex encoding', (done) => {
        enc = brambljs.utils.Hash.any('test text', 'hex');
        assert.equal(typeof enc, 'string');
        done();
    });
    it('base64 encoding', (done) => {
        enc = brambljs.utils.Hash.any('test text', 'base64');
        assert.equal(typeof enc, 'string');
        done();
    });
    it('base58 encoding', (done) => {
        enc = brambljs.utils.Hash.any('test text', 'base58');
        assert.equal(typeof enc, 'string');
        done();
    });
    it('filepath encoding', (done) => {
        enc = brambljs.utils.Hash.file(
            'keystore/2020-06-04T14-29-17.128Z-cAJRe7vqjwhg3f2Xt271RZiQKG1NvpYFPqZmfq6SKDE.json',
        );
        assert.equal(typeof enc, 'object');
        done();
    });
    it('message encoding', (done) => {
        enc = brambljs.utils.Hash.string('message');
        assert.equal(typeof enc, 'object');
        done();
    });
});
