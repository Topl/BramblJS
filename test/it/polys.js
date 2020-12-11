/** Unit testing for polys type funtionality:
 * - transfer poly
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
/*                          Polys type unit tests                             */
/* -------------------------------------------------------------------------- */
describe("Polys", () => {
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

    /* ---------------------------- transfer polys -------------------------------- */
    describe("transfer polys", () => {
        beforeEach(() => {
            parameters = {
                "recipient": "22222222222222222222222222222222222222222222",
                "sender": ["6sYyiTguyQ455w2dGEaNbrwkAWAEYV1Zk6FtZMknWDKQ"],
                "amount": 1,
                "fee": 0,
                "data": ""
            };
        });

        it('should transfer poly', async () => {
            // query params using params under beforeEach()
            // mock response data
            let jsonObject = {
                "jsonrpc": "2.0",
                "id": "1",
                "result": {
                    "txType": "PolyTransfer",
                    "txHash": "bGnxUP7Pqsm6ejVJtM6Fy49bYaMRnXYxy8GWmvodKoa",
                    "timestamp": 1586470958034,
                    "signatures": [],
                    "newBoxes": [
                        "7sCDKSMC3ULvm8PgTmDEPRQZ1HxpM5YThnWsU3friwJR",
                        "6DEwauT4qJCqDb3hW9eJnWmXCzQRQAnsgx3NjaWJ416r"
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
                            "nonce": "3596905697323859524"
                        }
                    ],
                    "boxesToRemove": [
                        "39HNS5UbKV75Ysqejt8mARN2vbtthNK2Fh3NEeHbEmry"
                    ],
                    "fee": 0
                }
            };

            // creates the response obj
            var responseObject = {"status":'200',json: () => { return jsonObject }};

            // stub the promise response
            sinon.restore(); // restore sinon to resolve promise with new obj
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve(responseObject));

            // make the call trying to test for
            var response = await brambljs.transferPolys(parameters);

            // do validation here
            assert.strictEqual(response.result.txType, "PolyTransfer");
            assert.strictEqual(response.result.txHash, "bGnxUP7Pqsm6ejVJtM6Fy49bYaMRnXYxy8GWmvodKoa");
        });
        it('should fail if no parameters present', function(done) {
            // make call without parameters
            brambljs
            .transferPolys()
            .then((response) => {
                done(new Error("should not succeded"));
            })
            .catch((error) => {
                expect(String(error)).to.equal('Error: A parameter object must be specified');
                done();
            });
        });
        it('should fail if no recipient provided', function(done) {
            // set "recipient" as empty string to validate
            parameters.recipient = "";

            brambljs
            .transferPolys(parameters)
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

            brambljs
            .transferPolys(parameters)
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

            brambljs
            .transferPolys(parameters)
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

            brambljs
            .transferPolys(parameters)
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
