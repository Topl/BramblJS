const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

describe("Asset", () => {
  before(() => {
    brambljs = new BramblJS();
  });

  it("should create assets", done => {
    brambljs
      .createAssets(
        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
        10,
        "testAssets",
        0,
        ""
      )
      .then(response => {
        console.log(response);
        assert.equal(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  /*it('should transfer assets', (done) => {
        brambljs.transferAssets('6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ', 'A9vRt6hw7w4c7b4qEkQHYptpqBGpKM5MGoXyrkGCbrfb', 1, 'testAssets', 0, '')
            .then((response) => {
                console.log(response)
                assert.equal(typeof response.result, 'object')
                done()
            })
            .catch((error) => {
                console.log(error)
            })
    })
    */
});
