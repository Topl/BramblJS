/** Unit testing for transaction type funtionality:
 * - create raw asset transfer
 * - create raw arbit transfer
 * - broadcast transaction
 * - lookup transaction by id
 * - lookup transaction in Mempool by id
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2020.12.8
 *
 * This test suite uses Mocha(https://mochajs.org/), Chai(https://www.chaijs.com/)
 * and Sinon(https://sinonjs.org/).
 */

"use strict";

const assert = require("assert");
const BramblJS = require("../../src/Modules/Requests");
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
const nodeFetch = require('node-fetch');

/* -------------------------------------------------------------------------- */
/*                       Transaction type unit tests                          */
/* -------------------------------------------------------------------------- */
describe("Transactions", () => {
    const localTestObj = {"status":'200',json: () => {
            return {"test":"dummy data"}
        }};

    // avoid server side calls and return dummy data
    function enforceLocalTesting(){
        return sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(localTestObj));
    }

    // run this before all tests
    before(() => {
        brambljs = new BramblJS();
    });

    // run this before every test
    afterEach(() => {
        sinon.restore();
    });

    /* ---------------------------- raw asset -------------------------------- */
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
            // set "assetCode" as empty string to validate
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
            // set "assetCode" as empty string to validate
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

    /* ---------------------------- raw arbit -------------------------------- */
    describe("create raw arbit transfer", () => {
        beforeEach(() => {
            parameters = {
                "recipient": "22222222222222222222222222222222222222222222",
                "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"],
                "amount": 1,
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

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.transferArbits(parameters);

            // do validation here
            assert.strictEqual(response.result.txType, "ArbitTransfer");
            assert.strictEqual(response.result.txHash, "EeRwxuVuMsrud2xfd2zXaADkqsAJkH6ve1WRNEXu2f7T");
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .transferArbits()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no recipient provided', function(done) {
            // set "assetCode" as empty string to validate
            parameters.recipient = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .transferArbits(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A recipient must be specified');
                done();
            });
        });
        it('should fail if no amount provided', function(done) {
            // set "assetCode" as empty string to validate
            parameters.amount = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .transferArbits(parameters)
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
            .transferArbits(parameters)
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
            .transferArbits(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: Invalid fee, a fee must be greater or equal to zero');
                done();
            });
        });
    });

    /* ---------------------------- broadcastTx ------------------------------ */
    describe("broadcast transaction", () => {
        beforeEach(() => {
            parameters = {
                "tx": {
                    "signatures": {
                        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": "oNvbqGatNR2aZTneYcF8JsmUDb1emh64FSvfN7Svf9t6edqGgEVYNLBebJrcCGXarr1HGUVQnLgVFysyyjU5wZa"
                    },
                    "txType": "AssetCreation",
                    "txHash": "3Z5SzHiCuHKPdn8wypN8GuhnWJkSL2ZtRVbJq4a1jLry",
                    "timestamp": 1586474743821,
                    "newBoxes": [
                        "5kSiDeEJLHSk52NxM5he5MzFyTSPKHwonuPsyXrnRYRw"
                    ],
                    "data": "",
                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                    "to": [
                        [
                            "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                            "10"
                        ]
                    ],
                    "assetCode": "test",
                    "fee": 0
                }
            };
        });

        it('should broadcast tx', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "txType": "AssetCreation",
                    "txHash": "3Z5SzHiCuHKPdn8wypN8GuhnWJkSL2ZtRVbJq4a1jLry",
                    "timestamp": 1586474743821,
                    "signatures": {
                        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": "oNvbqGatNR2aZTneYcF8JsmUDb1emh64FSvfN7Svf9t6edqGgEVYNLBebJrcCGXarr1HGUVQnLgVFysyyjU5wZa"
                    },
                    "newBoxes": [
                        "5kSiDeEJLHSk52NxM5he5MzFyTSPKHwonuPsyXrnRYRw"
                    ],
                    "data": "",
                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                    "to": [
                        [
                            "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                            "10"
                        ]
                    ],
                    "assetCode": "test",
                    "fee": 0
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.broadcastTx(parameters);

            // do validation here
            assert.strictEqual(response.result.txType, "AssetCreation");
            assert.strictEqual(response.result.txHash, "3Z5SzHiCuHKPdn8wypN8GuhnWJkSL2ZtRVbJq4a1jLry");
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .broadcastTx()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no tx object provided', function(done) {
            // set "tx" as empty string to validate
            parameters.tx = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .broadcastTx(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A tx object must be specified');
                done();
            });
        });
        it('should fail if no signature in tx object provided', function(done) {
            // set "tx.signatures" as empty obj to validate
            parameters.tx.signatures = {};
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .broadcastTx(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: Tx must include signatures');
                done();
            });
        });
        it('should fail if tx is missing keys', function(done) {
            // reduce tx to only signatures so tx obj is not valid
            parameters.tx = {
                "signatures": {
                    "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": "oNvbqGatNR2aZTneYcF8JsmUDb1emh64FSvfN7Svf9t6edqGgEVYNLBebJrcCGXarr1HGUVQnLgVFysyyjU5wZa"
                }
            }
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .broadcastTx(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: Invalid tx object, one or more tx keys not specified');
                done();
            });
        });
    });

    /* ---------------------------- Tx by id --------------------------------- */
    describe("get transaction by id", () => {
        beforeEach(() => {
            parameters = {
                "transactionId": "6XHxhYxe4TWXaXP9QQZroHN1bKU5sCdRdFrXe1p2WToF"
            };
        });

        it('should get tx by id', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "txType": "AssetCreation",
                    "txHash": "6XHxhYxe4TWXaXP9QQZroHN1bKU5sCdRdFrXe1p2WToF",
                    "timestamp": 1586479692408,
                    "signatures": {
                        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": "66TgRqmFbWVbZqMg7XRhkgD8mksucvt64anbZWHTYf1fABBKShaHZxW6BaUMQchxcChReDiQugRRMunAzzz2KAXx"
                    },
                    "newBoxes": [
                        "8FCKnXM8FECtLCLMhQt1vqBzD59bxhkFD7kzhAfGqGVZ"
                    ],
                    "data": "",
                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                    "to": [
                        [
                            "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                            "100"
                        ]
                    ],
                    "assetCode": "test",
                    "fee": 0,
                    "blockNumber": 1178,
                    "blockHash": "GMbv6Ku3BQQGFj2WeGY6aYweAiEBpKUHVSHey6eUY1jt"
                }
            }

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.getTransactionById(parameters);

            // do validation here
            assert.strictEqual(response.result.txType, "AssetCreation");
            assert.strictEqual(response.result.txHash, "6XHxhYxe4TWXaXP9QQZroHN1bKU5sCdRdFrXe1p2WToF");
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .getTransactionById()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no transactionId provided', function(done) {
            // set "tx" as empty string to validate
            parameters.transactionId = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .getTransactionById(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A transactionId must be specified');
                done();
            });
        });
    });

    /* ------------------------- Tx from Mempool ----------------------------- */
    describe("get transaction from Mempool", () => {
        beforeEach(() => {
            parameters = {
                "transactionId": "4GVrKSBM9WxMqtiFthia4cuZjWjSCT9idj3QpQjuRg58"
            };
        });

        it('should get tx by id', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "txType": "AssetCreation",
                    "txHash": "4GVrKSBM9WxMqtiFthia4cuZjWjSCT9idj3QpQjuRg58",
                    "timestamp": 1586480832023,
                    "signatures": {
                        "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": "5PagAA8tFRm5Ct5EJDC96ZhcbWhkCFzYYH9Wk8objK7b1sgRvQAwE38YBHDLzc84zwmvw6eVctEpHEgM7AYGNQsc"
                    },
                    "newBoxes": [
                        "4sZvp7evXPTVw6v9FiW7j26MCo7RUrcD7C3igKknPmZJ"
                    ],
                    "data": "",
                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                    "to": [
                        [
                            "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                            "100"
                        ]
                    ],
                    "assetCode": "test",
                    "fee": 0
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.getTransactionFromMempool(parameters);

            // do validation here
            assert.strictEqual(response.result.txType, "AssetCreation");
            assert.strictEqual(response.result.txHash, "4GVrKSBM9WxMqtiFthia4cuZjWjSCT9idj3QpQjuRg58");
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .getTransactionFromMempool()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no transactionId provided', function(done) {
            // set "tx" as empty string to validate
            parameters.transactionId = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .getTransactionFromMempool(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A transactionId must be specified');
                done();
            });
        });
    });
});
