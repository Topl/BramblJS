const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

describe("Asset", () => {
  before(() => {
    brambljs = new BramblJS();
  });

  it("should create assets", (done) => {
    const paramsCreate = {
      "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
      "assetCode": "testAssets",
      "recipient": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
      "amount": 10,
      "fee": 0
    };

    brambljs
        .createAssetsPrototype(paramsCreate)
        .then((response) => {
        // console.log("Create Assets Response: ", response);
          assert.strictEqual(typeof response.result, "object");
          done();
        })
        .catch((error) => {
          console.log("Create Assets ERROR: ", error);
          done(new Error("Create Assets Failed"));
        });
  });

  it("should transfer assets", (done) => {
    const paramsTransfer = {
      "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
      "assetCode": "testAssets",
      "recipient": "DXLLQ1cX8MDG3QjCdkH1Q9w3G1UQDU8f2gb4865fNJSh",
      "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"],
      "amount": 2,
      "fee": 0
    };

    brambljs
        .transferAssetsPrototype(paramsTransfer)
        .then((response) => {
          // console.log("Transfer Assets Response: ", response);
          assert.strictEqual(typeof response.result, "object");
          done();
        })
        .catch((error) => {
          console.log("Transfer Assets ERROR: ", error);
          done(new Error("Transfer Assets Failed"));
        });
  });
});
