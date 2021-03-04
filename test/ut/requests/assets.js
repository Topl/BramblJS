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

const Requests = require("../../../src/modules/Requests");
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
        requests = new Requests();
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

    /* ---------------------------- create raw asset -------------------------------- */
    describe("create raw asset transfer", () => {
        beforeEach(() => {
            parameters = {
                "propositionType": "PublicKeyCurve25519",
                "recipients": [
                  ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 2]
                ],
                "assetCode": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
                "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
                "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",//brambl.keyManager.pk
                "minting": true,
                "fee": 1
              }
        });

        // it('should NOT fail if parameters are valid', function(done) {
        //     const validParameters = ["amount", "assetCode", "data",
        //     "fee", "issuer", "recipient", "sender"];
        //     expect(parameters).to.contain.keys(validParameters);

        //     requests
        //     .createRawAssetTransfer(parameters)
        //     .then((response) => {
        //         assert.strictEqual(typeof response, "object");
        //         assert.strictEqual(response.test, "dummy data");
        //         done();
        //     })
        //     .catch((error) => {
        //         done(new Error("Parameters Error: " + error));
        //     });
        // });

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
            sinon.restore(); // restore sinon to resolve promise with new obj
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await requests.createRawAssetTransfer(parameters);

            // do validation here
            assert.strictEqual(response.result.formattedTx.txHash, "2ChyrPLSdAXof49X2cd75PmT2Jz1xZdphHkf4WLzdfdW");
        });
        it('should fail if no parameters present', function(done) {
            // make call without parameters
            requests
            .createRawAssetTransfer()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no sender provided', function(done) {
            // set "sender" as empty string to validate
            parameters.sender = "";

            requests
            .createRawAssetTransfer(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: An asset sender must be specified');
                done();
            });
        });
        it('should fail if no assetCode provided', function(done) {
            // set "assetCode" as empty string to validate
            parameters.assetCode = "";

            requests
            .createRawAssetTransfer(parameters)
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
            parameters.recipients = "";

            requests
            .createRawAssetTransfer(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: At least one recipient must be specified');
                done();
            });
        });
        // it('should fail if no amount provided', function(done) {
        //     // set "amount" as empty string to validate
        //     parameters.amount = "";

        //     requests
        //     .createRawAssetTransfer(parameters)
        //     .then((response) => {
        //         done(new Error("should not succeded"));
        //     })
        //     .catch((error) => {
        //         expect(String(error)).to.equal('Error: An amount must be specified');
        //         done();
        //     });
        // });
        it('should fail if no fee provided', function(done) {
            // set "fee" as empty string to validate
            parameters.fee = "";

            requests
            .createRawAssetTransfer(parameters)
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

            requests
            .createRawAssetTransfer(parameters)
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
