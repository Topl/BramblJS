const assert = require("assert");
const Requests = require("../../src/modules/Requests");

describe("Arbit", () => {
  before(() => {
    brambljs = new Requests();
  });
  it("should transfer arbits", (done) => {
    // query params
    const parameters = {
      "recipient": "22222222222222222222222222222222222222222222",
      "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"],
      "amount": 1,
      "fee": 0,
      "data": ""
    };
    // sample responseJson
    let resObject = {
      "jsonrpc": "2.0",
      "id": "1",
      "result": {
        "txType": "ArbitTransfer",
        "txHash": "EeRwxuVuMsrud2xfd2zXaADkqsAJkH6ve1WRNEXu2f7T",
        "timestamp": 1586471049860,
        "signatures": [],
        "newBoxes": [
            "iDW8A5GdVcSP1P6VdmSAkRFHTrSZ63G2PTvQZx8zy9a",
            "5oMe9ybDBpBSr8nXYLNoAb2Lf4no81xoxLgcXWNf4UqA"
        ],
        "data": "",
        "to": [
            {
                "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                "value": "99999999"
            },
            {
                "proposition": "22222222222222222222222222222222222222222222",
                "value": "1"
            }
        ],
        "from": [
            {
                "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                "nonce": "-269532489367390959"
            }
        ],
        "boxesToRemove": [
            "852rQUseapF1mRUvN9Nu8Vt9Dt7ahj7X9aZ4s3xzeanj"
        ],
        "fee": 0
      }
    };

    brambljs
    .transferArbits(parameters)
    .then((response) => {
      assert.strictEqual(typeof response.result, "object");
      assert.strictEqual(response.result.txType, "ArbitTransfer");
      assert.strictEqual(response.result.txHash, "EeRwxuVuMsrud2xfd2zXaADkqsAJkH6ve1WRNEXu2f7T");
      done();
    })
    .catch((error) => {
      console.log("Transfer Arbits ERROR: ", error);
      done(new Error("Transfer Arbits Failed"));
    });
  });
});
