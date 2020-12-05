const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

const Assert = require('assert');
const nodeFetch = require('node-fetch');
const Requests = require("../../src/Modules/Requests");

afterEach(() => {
    sinon.restore();
});

beforeEach(() => {
    brambljs = new BramblJS();
});

describe("Keyfiles", () => {
    const password = "encryption_password";
    let publicKey = "";

    describe("generate keyfile", () => {
        it('should generate keyfile', async () => {
            // query params
            const parameters = {"password": password};

            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "publicKey": "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C"
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var result = await brambljs.generateKeyfile(parameters);

            // do validation here
            assert.strictEqual(result.result.publicKey, "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C");
        });

        it('should fail if no parameters present', function(done) {
            brambljs
            .generateKeyfile()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no password provided', function(done) {
            // query params
             const parameters = {"password": ""};
            // var responseObject = {"status":'200',json: () => { return {"msg":"PREVENT SERVER CALL"} }};
            // sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            brambljs
            .generateKeyfile(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A password must be provided to encrypt the keyfile');
                done();
            });
        });
    });

    describe("open keyfiles", () => {
        it('should return list of keyfiles', async () => {
            // query params
            const parameters = {};

            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": [
                    "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                    "2DXfMJC2ZiawT7ricXebntPiBKuPYkyXYDgfBJhsCKxS"
                ]
            }

            var responseObject = {"status":'200',json: () => { return jsonObject }};
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            var result = await brambljs.listOpenKeyfiles();

            // validation
            expect(result).to.be.a('object');
            assert.strictEqual(result.result[0], "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ");
        });
    });

    describe("lock keyfiles", () => {
        it('should make api call to lock keyfile', async () => {
            // query params
            const parameters = {
                "publicKey": "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C",
                "password": "topl_the_world"
            };

            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "locked"
                }
            }

            var responseObject = {"status":'200',json: () => { return jsonObject }};
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            //expect(fetchSpy.args).toBe("a");
            var response = await brambljs.lockKeyfile(parameters);

            // validation
            expect(response).to.be.a('object');
            expect(response.result).to.deep.equal({
                "7HxSUU6yS8f7JLaEKnC4b1CSp23v5BKofx2Tb24P5WhL": "locked"
            });
        });
        it('should fail if no parameters provided', function(done) {
            brambljs
            .lockKeyfile()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no pubKey provided', function(done) {
            // query params
             const parameters = {
                "publicKey": "",
                "password": "topl_the_world"
            };

            brambljs
            .lockKeyfile(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A publicKey field must be specified');
                done();
            });
        });
        it('should fail if no password provided', function(done) {
            // query params
             const parameters = {
                "publicKey": "CACjU6PmX7RJRQ61BRkkMtwQyLqtYkapXSGwb13u2F4C",
                "password": ""
            };

            brambljs
            .lockKeyfile(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A password must be provided to encrypt the keyfile');
                done();
            });
        });
    });

    // describe("Wrap existing method", function() {
    //     const sandbox = sinon.createSandbox();
    
    //     beforeEach(function() {
    //         sandbox.spy(Requests, "bramblRequest");
    //     });
    
    //     afterEach(function() {
    //         sandbox.restore();
    //     });
    
    //     it("should inspect jQuery.getJSON's usage of jQuery.ajax", function() {
    //         const url = "https://jsonplaceholder.typicode.com/todos/1";
    //         //jQuery.getJSON(url);
    
    //         //assert(jQuery.ajax.calledOnce);
    //         //assert.equals(url, jQuery.ajax.getCall(0).args[0].url);
    //         //assert.equals("json", jQuery.ajax.getCall(0).args[0].dataType);
    //     });
    // });
});
