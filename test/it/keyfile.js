const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

describe("Keyfile", () => {
  before(() => {
    brambljs = new BramblJS();
  });

  it("should return a list of open keyfiles", done => {
    brambljs
      .getOpenKeyfiles()
      .then(response => {
        console.log(response);
        assert.equal(typeof response.result, "object");
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
        assert.equal(typeof response.result, "object");
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
        assert.equal(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  it("should return a successfully unlocked keyfile", done => {
    brambljs
      .unlockKeyfile("6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ", "genesis")
      .then(response => {
        assert.equal(typeof response.result, "object");
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });
});
