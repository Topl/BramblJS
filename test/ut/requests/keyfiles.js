/** Unit testing for keyfiles type funtionality:
 * - generate keyfile
 * - list open keyfiles
 * - lock keyfile
 * - unlock keyfile
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2020.12.8
 *
 * This test suite uses Mocha(https://mochajs.org/), Chai(https://www.chaijs.com/)
 * and Sinon(https://sinonjs.org/).
 */

const Requests = require("../../../src/modules/Requests");
const assert = require("assert");
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const nodeFetch = require('node-fetch');

/* -------------------------------------------------------------------------- */
/*                         Keyfile type unit tests                            */
/* -------------------------------------------------------------------------- */
describe("Keyfiles", () => {
    const localTestObj = {"status":'200',json: () => { return {"test":"dummy data"} }};

    /**
     * Every test will have a localTestObj returned
     * as a succesfull call. This ensures the call
     * doesn't leave our local environment and prevents
     * tests from hanging until a timeout is reached.
     */
    function enforceLocalTesting(){
        return sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(localTestObj));
    }

    // run this before all tests
    before(() => {
        brambljs = new Requests();
    });

    // run this before every test
    beforeEach(() => {
        // avoid server side calls and return dummy data
        enforceLocalTesting();
    });

    // run this after every test
    afterEach(() => {
        sinon.restore();
    });

    /* ---------------------------- generate keyfile -------------------------------- */
    // describe("generate keyfile", () => {
    //     beforeEach(() => {
    //         parameters = {
    //             "password": "foo"
    //         };
    //     });
    //     it('should generate keyfile', async () => {
    //         // query params using params under beforeEach()
    //         // mock response data
    //         let jsonObject = {
    //             "jsonrpc": "2.0",
    //             "id": "1",
    //             "result": {
    //                 "publicKey": "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C"
    //             }
    //         };

    //         // creates the response obj
    //         var responseObject = {"status":'200',json: () => { return jsonObject }};

    //         // stub the promise response
    //         sinon.restore(); // restore sinon to resolve promise with new obj
    //         sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

    //         // make the call trying to test for
    //         var response = await brambljs.generateKeyfile(parameters);

    //         // do validation here
    //         assert.strictEqual(response.result.publicKey, "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C");
    //     });
    //     it('should fail if no parameters present', function(done) {
    //         // make call without parameters
    //         brambljs
    //         .generateKeyfile()
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A parameter object must be specified');
    //             done();
    //         });
    //     });
    //     it('should fail if no password provided', function(done) {
    //         // set "password" as empty string to validate
    //         parameters.password = "";

    //         brambljs
    //         .generateKeyfile(parameters)
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A password must be provided to encrypt the keyfile');
    //             done();
    //         });
    //     });
    // });

    /* --------------------------- list open keyfiles ------------------------------- */
    // describe("list open keyfiles", () => {
    //     it('should return list of keyfiles', async () => {
    //         // mock parameters
    //         let parameters = {
    //             "password": "foo"
    //         };

    //         // mock response data
    //         let jsonObject = {
    //             "jsonrpc": "2.0",
    //             "id": "1",
    //             "result": [
    //                 "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
    //                 "2DXfMJC2ZiawT7ricXebntPiBKuPYkyXYDgfBJhsCKxS"
    //             ]
    //         }

    //         var responseObject = {"status":'200',json: () => { return jsonObject }};
    //         sinon.restore(); // restore sinon to resolve promise with new obj
    //         sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

    //         var response = await brambljs.listOpenKeyfiles();

    //         // validation
    //         expect(response).to.be.a('object');
    //         assert.strictEqual(response.result[0], "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ");
    //     });
    // });

    /* ------------------------------ lock keyfile ---------------------------------- */
    // describe("lock keyfiles", () => {
    //     beforeEach(() => {
    //         parameters = {
    //             "publicKey": "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL",
    //             "password": "foo"
    //         };
    //     });
    //     it('should make api call to lock keyfile', async () => {
    //         // query params using params under beforeEach()
    //         // mock response data
    //         let jsonObject = {
    //             "jsonrpc": "2.0",
    //             "id": "1",
    //             "result": {
    //                 "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "locked"
    //             }
    //         }

    //         var responseObject = {"status":'200',json: () => { return jsonObject }};
    //         sinon.restore(); // restore sinon to resolve promise with new obj
    //         sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

    //         var response = await brambljs.lockKeyfile(parameters);

    //         // validation
    //         expect(response).to.be.a('object');
    //         expect(response.result).to.deep.equal({
    //             "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "locked"
    //         });
    //     });
    //     it('should fail if no parameters provided', function(done) {
    //         brambljs
    //         .lockKeyfile()
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A parameter object must be specified');
    //             done();
    //         });
    //     });
    //     it('should fail if no pubKey provided', function(done) {
    //         // set "publicKey" as empty string to validate
    //         parameters.publicKey = "";

    //         brambljs
    //         .lockKeyfile(parameters)
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A publicKey field must be specified');
    //             done();
    //         });
    //     });
    //     it('should fail if no password provided', function(done) {
    //         // set "password" as empty string to validate
    //         parameters.password = "";

    //         brambljs
    //         .lockKeyfile(parameters)
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A password must be provided to encrypt the keyfile');
    //             done();
    //         });
    //     });
    // });

    /* ----------------------------- unlock keyfile --------------------------------- */
    // describe("unlock keyfiles", () => {
    //     beforeEach(() => {
    //         parameters = {
    //             "publicKey": "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL",
    //             "password": "foo"
    //         };
    //     });
    //     it('should make api call to unlock keyfile', async () => {
    //         // query params using params under beforeEach()
    //         // mock response data
    //         let jsonObject = {
    //             "jsonrpc": "2.0",
    //             "id": "1",
    //             "result": {
    //                 "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "unlocked"
    //             }
    //         }

    //         var responseObject = {"status":'200',json: () => { return jsonObject }};
    //         sinon.restore(); // restore sinon to resolve promise with new obj
    //         sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

    //         //expect(fetchSpy.args).toBe("a");
    //         var response = await brambljs.lockKeyfile(parameters);

    //         // validation
    //         expect(response).to.be.a('object');
    //         expect(response.result).to.deep.equal({
    //             "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "unlocked"
    //         });
    //     });
    //     it('should fail if no parameters provided', function(done) {
    //         // make call without parameters
    //         brambljs
    //         .lockKeyfile()
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A parameter object must be specified');
    //             done();
    //         });
    //     });
    //     it('should fail if no pubKey provided', function(done) {
    //         // set "publicKey" as empty string to validate
    //         parameters.publicKey = "";

    //         brambljs
    //         .lockKeyfile(parameters)
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A publicKey field must be specified');
    //             done();
    //         });
    //     });
    //     it('should fail if no password provided', function(done) {
    //         // set "password" as empty string to validate
    //         parameters.password = "";

    //         brambljs
    //         .lockKeyfile(parameters)
    //         .then((response) => {
    //             done(new Error("should not succeded"));
    //         })
    //         .catch((error) => {
    //             expect(String(error)).to.equal('Error: A password must be provided to encrypt the keyfile');
    //             done();
    //         });
    //     });
    // });
});
