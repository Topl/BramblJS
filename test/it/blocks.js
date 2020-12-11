/** Unit testing for blocks type funtionality:
 * - Lookup Block
 * - Get the latest block in the chain
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2020.12.8
 *
 * This test suite uses Mocha(https://mochajs.org/), Chai(https://www.chaijs.com/)
 * and Sinon(https://sinonjs.org/).
 */

const Requests = require("../../src/modules/Requests");
const assert = require("assert");
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const nodeFetch = require('node-fetch');

/* -------------------------------------------------------------------------- */
/*                         Blocks type unit tests                             */
/* -------------------------------------------------------------------------- */
describe("Blocks", () => {
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

    /* ---------------------------- lookup block by id -------------------------------- */
    describe("lookup block by id", () => {
        beforeEach(() => {
            parameters = {
                "blockId": "GMbv6Ku3BQQGFj2WeGY6aYweAiEBpKUHVSHey6eUY1jt"
            }
        });

        it('should lookup block by id', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "timestamp": 1586479749120,
                    "inflation": 0,
                    "signature": "2K5A8UNwKFYF9ZUroanzV4JqSAK6tzsYe5fTxcfSdS4HFzfzj9bymcsSscfiRm56BVuMDYutWsmUTiCA45j8xtaW",
                    "blockSize": 597,
                    "generatorBox": "111zEddudjZtxDVS3hwEhvLt2WfTbLt939RYCpm3FXQwbc3Wie9h489iGQVyBaiJrqxsZTCs5xEUMP6N",
                    "version": 3,
                    "id": "GMbv6Ku3BQQGFj2WeGY6aYweAiEBpKUHVSHey6eUY1jt",
                    "txs": [
                        {
                            "txType": "CoinbaseTransaction",
                            "txHash": "CjKnYRWHVUDQxU8fcV18Mk3MzWWJmHDkm3jdMwyUyGuB",
                            "timestamp": 1586479749119,
                            "signatures": [
                                "4BvL4e7LLzX9GxHVpW3PPD1AmqvpjzuNWekqpCeN81uopwt7v69c4caRzNqeGkTmT1o1odrDrk8BqoKkDfc8DG4B"
                            ],
                            "newBoxes": [],
                            "to": [
                                {
                                    "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                    "value": 0
                                }
                            ],
                            "fee": 0
                        },
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
                    ],
                    "parentId": "DkhceFXCgPBhtn6X9LNdcf3b7wck3zzpMtQggmdcPQkQ",
                    "blockNumber": 1178,
                    "blockDifficulty": 12994701517
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.restore(); // restore sinon to resolve promise with new obj
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.getBlockById(parameters);

            // do validation here
            assert.strictEqual(response.result.id, "GMbv6Ku3BQQGFj2WeGY6aYweAiEBpKUHVSHey6eUY1jt");
            assert.strictEqual(response.result.version, 3);
            assert.strictEqual(response.result.blockNumber, 1178);
        });
        it('should fail if no parameters present', function(done) {
            // make call without parameters
            brambljs
            .getBlockById()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no blockId provided', function(done) {
            // set "recipient" as empty string to validate
            parameters.blockId = "";

            brambljs
            .getBlockById(parameters)
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A blockId must be specified');
                done();
            });
        });
    });

    /* -------------------- Get the latest block in the chain --------------------------- */
    describe("get the latest block in the chain", () => {
        it('should return latest block in chain', async () => {
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "score": 16736420219225,
                    "height": "629",
                    "stateVersion": "G8kyTgM8Gd9HaTvsVHP11HLmummCZGBst5ABXEnUiCTZ",
                    "bestBlock": {
                        "timestamp": 1586475020360,
                        "inflation": 0,
                        "signature": "wFEvphFVQ6VS6afoQDLeEdz9i6cYF8haWqt8ZvPaWiMmpaTTdE3o1zuTYPtRsAq5wWowFUkd7xbaJodC6NiyjBr",
                        "blockSize": 372,
                        "generatorBox": "111zEddudjZtxDVS3hwEhvLt2WfTbLt939RYCpm3FXQwbc3Wie9h489iGQVyBaiJrqxsZTCs5xEUMP6N",
                        "version": 3,
                        "id": "G8kyTgM8Gd9HaTvsVHP11HLmummCZGBst5ABXEnUiCTZ",
                        "txs": [
                            {
                                "txType": "CoinbaseTransaction",
                                "txHash": "7AuvHdcztKm5vwesq4UBVoqoNc9zTGATQLWWnk8FEQDZ",
                                "timestamp": 1586475020359,
                                "signatures": [
                                    "4Rr8VVJfzHWKJM7g61hQzdPZ8H63RCSjQLUnhF4HsbCE1e6gYg9KpZw4SxeLVAg39t2toXg2yLs18aeZpFupdFGN"
                                ],
                                "newBoxes": [],
                                "to": [
                                    {
                                        "proposition": "6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ",
                                        "value": 0
                                    }
                                ],
                                "fee": 0
                            }
                        ],
                        "parentId": "ECtW7zZLaYkdoFDYTKNm9t67Rf7Ys6unSxDxRP6kMqg4"
                    },
                    "bestBlockId": "G8kyTgM8Gd9HaTvsVHP11HLmummCZGBst5ABXEnUiCTZ"
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.restore(); // restore sinon to resolve promise with new obj
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.chainInfo(parameters);

            // do validation here
            assert.strictEqual(typeof response.result, "object");
            assert.strictEqual(typeof response.result.bestBlock, "object");
            assert.strictEqual(response.result.bestBlockId, "G8kyTgM8Gd9HaTvsVHP11HLmummCZGBst5ABXEnUiCTZ");
        });
    });
});
