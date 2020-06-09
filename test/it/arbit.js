const assert = require('assert');
const BramblJS = require('../../dist/modules/Requests.js');

describe('Arbit', () => {
    before(() => {
        brambljs = new BramblJS({
            url: 'https://valhalla.torus.topl.co/',
            apiKey: process.env.VALHALLA_KEY,
        });
    });

    it('should transfer arbits', (done) => {
        brambljs
            .transferArbits(
                'A9vRt6hw7w4c7b4qEkQHYptpqBGpKM5MGoXyrkGCbrfb',
                ['6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ'],
                1,
                0,
                '',
            )
            .then((response) => {
                console.log(response);
                assert.equal(typeof response.result, 'object');
                done();
            })
            .catch((error) => {
                console.log(error);
            });
    });
});
