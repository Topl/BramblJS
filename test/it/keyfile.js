const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");

/**
 * TODO: RA - include all these unit tests
 * Console logs are commented to have a clean result output.
 * Need to have a logging mechanisms with a level toggle when debugging.
 */

describe("Keyfile", () => {
  const password = "encryption_password";
  let publicKey = "";

  before(() => {
    brambljs = new BramblJS();
  });

  it("should return ERR if no password is provided to generate keyfile", (done) => {
    brambljs
        .generateKeyfile()
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
        // console.log(error);
          assert.throws((error) => {
            throw new Error(error);
          }, Error, "Error: A parameter object must be specified");
          done();
        });
  });

  it("should return a newly generated keyfile", (done) => {
    const parameters = {
      "password": password
    };

    brambljs
        .generateKeyfile(parameters)
        .then((response) => {
        // console.log("Newly generated KeyFile: ", response);
          assert.strictEqual(typeof response.result, "object");
          publicKey = response.result.publicKey; // To be reused in future test down below
          done();
        })
        .catch((error) => {
          console.log(error);
          done(new Error("Newly generated KeyFile Failed"));
        });
  });

  it("should return a list of open keyfiles", (done) => {
    brambljs
        .listOpenKeyfiles()
        .then((response) => {
        // console.log("List of open key files: ", response);
          assert.strictEqual(typeof response.result, "object");
          done();
        })
        .catch((error) => {
          console.log(error);
          done(new Error("List of open key files Failed"));
        });
  });

  it("should return a successfully locked keyfile", (done) => {
    const parameters = {
      "publicKey": publicKey,
      "password": password
    };

    brambljs
        .lockKeyfile(parameters)
        .then((response) => {
        // console.log("LockedKeyFile Response: ", response);
          assert.strictEqual(typeof response.result, "object");
          done();
        })
        .catch((error) => {
          console.log(error);
          done(new Error("LockedKeyFile Failed"));
        });
  });
});
