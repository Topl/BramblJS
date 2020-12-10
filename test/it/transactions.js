/** Unit testing for transaction type funtionality:
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

const Requests = require("../../src/Modules/Requests");
const assert = require("assert");
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
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
        brambljs = new Requests();
    });

    // run this before every test
    afterEach(() => {
        sinon.restore();
    });

    /* --------------------------- broadcast Tx ------------------------------ */
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

    /* ------------------------- Get Mempool ----------------------------- */
    describe("get mempool", () => {
        it('should get mempool', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": [
                    {
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
                        "fee": 0
                    }
                ]
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.getMempool(parameters);

            // do validation here
            assert.strictEqual(typeof response.result, "object");
        });
    });

    /* ------------------------- Lookup Balances ----------------------------- */
    describe("lookup balances", () => {
        beforeEach(() => {
            parameters =  {
                "publicKeys": [
                    "22222222222222222222222222222222222222222222",
                    "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"
                ]
            };
        });

        it('should get balances using PubKeysId list', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "22222222222222222222222222222222222222222222": {
                        "Balances": {
                            "Polys": "0",
                            "Arbits": "0"
                        },
                        "Boxes": {
                            "Asset": [
                                {
                                    "nonce": "-4529498046359676742",
                                    "data": "",
                                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "assetCode": "test",
                                    "id": "9eKHfJzfWxZ1nw7HM9asUsKx3XnFT611uJBEWVgq1t1Q",
                                    "type": "Asset",
                                    "proposition": "22222222222222222222222222222222222222222222",
                                    "value": "1"
                                }
                            ]
                        }
                    },
                    "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ": {
                        "Balances": {
                            "Polys": "100000000",
                            "Arbits": "100000000"
                        },
                        "Boxes": {
                            "Asset": [
                                {
                                    "nonce": "-3898410089397904521",
                                    "data": "",
                                    "issuer": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "assetCode": "test",
                                    "id": "HdXwi2FhUFtkRSgogEoazFQkTQ8qhgqTDBVmN8syyNL2",
                                    "type": "Asset",
                                    "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "value": "100"
                                }
                            ],
                            "Poly": [
                                {
                                    "nonce": "3596905697323859524",
                                    "id": "39HNS5UbKV75Ysqejt8mARN2vbtthNK2Fh3NEeHbEmry",
                                    "type": "Poly",
                                    "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "value": "100000000"
                                }
                            ],
                            "Arbit": [
                                {
                                    "nonce": "-269532489367390959",
                                    "id": "852rQUseapF1mRUvN9Nu8Vt9Dt7ahj7X9aZ4s3xzeanj",
                                    "type": "Arbit",
                                    "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "value": "100000000"
                                }
                            ]
                        }
                    }
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.getBalancesByKey(parameters);

            // do validation here
            assert.strictEqual(typeof response.result, "object");
            expect(response.result).to.contain.keys('22222222222222222222222222222222222222222222','6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ');
        });
        it('should fail if no parameters present', function(done) {
            // avoid server side calls
            enforceLocalTesting();

            // make call without parameters
            brambljs
            .getBalancesByKey()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no publicKeys provided', function(done) {
            // set "tx" as empty string to validate
            parameters.publicKeys = "";
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .getBalancesByKey(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A list of publicKeys must be specified');
                done();
            });
        });
        it('should fail if publicKeys is not an array', function(done) {
            // set "tx" as empty string to validate
            parameters.publicKeys = {};
            // avoid server side calls
            enforceLocalTesting();

            brambljs
            .getBalancesByKey(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A list of publicKeys must be specified');
                done();
            });
        });
    });
});
