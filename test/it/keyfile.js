const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

/**
 * This test cases should cover the following:
 * 1. create keyfile
 * 2. get list of keyfiles
 * 3. get
 */

describe("Keyfile", () => {
  before(() => {
    brambljs = new BramblJS();
  });

  it("should return a list of open keyfiles", done => {
    brambljs
      .listOpenKeyfiles()
      .then(response => {
        console.log(response);
        assert.strictEqual(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  it("should return a newly generated keyfile", done => {
    brambljs
      .generateKeyfile("password")
      .then(response => {
        console.log(response);
        assert.strictEqual(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  it("should return a successfully locked keyfile", done => {
    brambljs
      .lockKeyfile("6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ", "genesis")
      .then(response => {
        console.log(response);
        assert.strictEqual(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });
});
