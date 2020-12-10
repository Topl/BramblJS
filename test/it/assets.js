/** Unit testing for assets type funtionality:
 * - create raw asset transfer
 * - transfer raw asset transfer
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2020.12.8
 *
 * This test suite uses Mocha(https://mochajs.org/), Chai(https://www.chaijs.com/)
 * and Sinon(https://sinonjs.org/).
 */

const Requests = require("../../src/Modules/Requests");
const assert = require("assert");
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const nodeFetch = require('node-fetch');

/* -------------------------------------------------------------------------- */
/*                       Assets type unit tests                          */
/* -------------------------------------------------------------------------- */
describe("Assets", () => {
    const localTestObj = {"status":'200',json: () => {
            return {"test":"dummy data"}
        }};

    // avoid server side calls and return dummy data
    function enforceLocalTesting(){
        return sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(localTestObj));
    }

    // run this before all tests
    before(() => {
        brambljs = new Requests();
    });

    // run this before every test
    afterEach(() => {
        sinon.restore();
    });

    /* ---------------------------- create raw asset -------------------------------- */
    describe("create raw asset transfer", () => {
        beforeEach(() => {
            parameters = {
                "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                "recipient": "22222222222222222222222222222222222222222222",
                "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"],
                "amount": 10,
                "assetCode": "test",
                "fee": 0,
                "data": ""
            };
        });

        it('should create raw asset', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "formattedTx": {
                        "txType": "AssetTransfer",
                        "txHash": "2ChyrPLSdAXof49X2cd75PmT2Jz1xZdphHkf4WLzdfdW",
                        "timestamp": 1586470624541,
                        "signatures": {},
                        "newBoxes": [
                            "3gWhYUcC4FngBjJo31wMmytfNvodAQMuUcss5dkwTTpV",
                            "k7KY9K9JczYFekMkHkBozs3y1VkasTP4Tgbzg3W49Qb"
                        ],
                        "data": "",
                        "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                        "to": [
                            [
                                "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                "90"
                            ],
                            [
                                "22222222222222222222222222222222222222222222",
                                "10"
                            ]
                        ],
                        "assetCode": "test",
                        "from": [
                            [
                                "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                "-3898410089397904521"
                            ]
                        ],
                        "boxesToRemove": [
                            "HdXwi2FhUFtkRSgogEoazFQkTQ8qhgqTDBVmN8syyNL2"
                        ],
                        "fee": 0
                    },
                    "messageToSign": "2BLh7ZpAeCSgv9eiZWrh7ReW3ku2UXRkeYGYECodWja6fbAtYR5S8baZqtyzA4CXx2JgeBcf6zdiNBuHPa882UN7BrGPn9PGzzjr4DzGvrh3Xj8ai1yaYeCMwRzvJ14zfuomW1b6rPLasJEK3hpmbbx345uKHLLXFcmBMjbhhFX7ATkFHjqijGaHi389CeL9A5hWiAo8g4DojwpTum836GrD9z1DzeVmNpUgsZciGR2gxGTBgTBBFrcPQYXs17155QVP9KCqx7SD2EPx54K2vpvhXdQ9u8VuScMcVtKJc3V1usDpWGfRVvzzm2rfnSSQKmMN9hq6bZT6xxYyHtsb4Hu38oBya9cwcpoYdCEWL8YVgvHUpd34XYkhZawpuS2NzwhPYyqPigeGPmYvG2r8Qt883frMwp6hTWys8SvsLeebvQykpbjCyMu"
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.createAssetsPrototype(parameters);

            // do validation here
            assert.strictEqual(response.result.formattedTx.txHash, "2ChyrPLSdAXof49X2cd75PmT2Jz1xZdphHkf4WLzdfdW");
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .createAssetsPrototype()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no issuer provided', function(done) {
            // set "issuer" as empty string to validate
            parameters.issuer = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: An asset issuer must be specified');
                done();
            });
        });
        it('should fail if no assetCode provided', function(done) {
            // set "assetCode" as empty string to validate
            parameters.assetCode = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: An assetCode must be specified');
                done();
            });
        });
        it('should fail if no recipient provided', function(done) {
            // set "recipient" as empty string to validate
            parameters.recipient = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A recipient must be specified');
                done();
            });
        });
        it('should fail if no amount provided', function(done) {
            // set "amount" as empty string to validate
            parameters.amount = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: An amount must be specified');
                done();
            });
        });
        it('should fail if no fee provided', function(done) {
            // set "fee" as empty string to validate
            parameters.fee = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A fee must be specified');
                done();
            });
        });
        it('should fail if fee < 0', function(done) {
            // set "fee" a value < 0
            parameters.fee = -23;
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .createAssetsPrototype(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: Invalid fee, a fee must be greater or equal to zero');
                done();
            });
        });
    });
});
