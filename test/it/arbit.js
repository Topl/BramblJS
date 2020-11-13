const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

describe("Arbit", () => {

  before(() => {
    brambljs = new BramblJS();
  });

  it("should transfer arbits", done => {
    const params_transferArbits = {
      "recipient": "A9vRt6hw7w4c7b4qEkQHYptpqBGpKM5MGoXyrkGCbrfb",
      "amount": 1,
      "fee": 0,
      "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"]
    };

    brambljs
      .transferArbits(params_transferArbits)
      .then(response => {
        //console.log("Transfer Arbits Response: ", response);
        assert.strictEqual(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log("Transfer Arbits ERROR: ", error);
        done(new Error("Transfer Assets Failed"));
      });
  });
});
