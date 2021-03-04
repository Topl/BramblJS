/**
 * @fileOverview Unit testing for Brambl Module
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2021.01.05
 *
 */

const BrabmlJS = require("../../../src/Brambl");
const KeyManager = require("../../../src/modules/KeyManager");
const Requests = require("../../../src/modules/Requests");

const assert = require("assert");
const chai = require('chai');
const expect = chai.expect;
const fs = require("fs");

/* -------------------------------------------------------------------------- */
/*                          Brambl unit tests                             */
/* -------------------------------------------------------------------------- */
describe("Brambl", () => {
    // run this before all tests
    before(() => {
        defaultTestOptions = {
            // Symmetric cipher for private key encryption
            cipher: "aes-256-ctr",

            // Initialization vector size in bytes
            ivBytes: 16,

            // Private key size in bytes
            keyBytes: 32,

            // Key derivation function parameters
            scrypt: {
                dkLen: 32,
                n: Math.pow(2, 3), // decrease n to 2^3 to speed up the tests
                r: 8, // blocksize
                p: 1 // parallelization
            }
        };
        keyMan = new KeyManager({
            'password': 'topl_the_world',
            'constants': defaultTestOptions
        });
        requests = new Requests();
    });

    // run this before every test
    beforeEach(() => {
    });

    // run this after every test
    afterEach(() => {
    });

    /* ---------------------------- Brambl Constructor Tests -------------------------------- */
    describe('new brambl()', function() {

        /* ---------------------------- network prefixes -------------------------------- */
        // it('should pass by passing only password', async () => {
        //     const brambl = new BrabmlJS("this_is_a_test_password");
        //     assert.strictEqual(brambl.networkPrefix, "local", "network prefix is local");
        // });
        it('should pass by passing password and networkPrefix', async () => {
            const brambl = new BrabmlJS({
                networkPrefix: "valhalla",
                password: "this_is_a_test_password",
                KeyManager: {
                    'constants': defaultTestOptions // reduce the exec time
                }
            });
            assert.strictEqual(brambl.networkPrefix, "valhalla", "network prefix is valhalla");
        });
        it('should default empty network prefix to private', async () => {
            const brambl = new BrabmlJS({
                KeyManager: keyMan // use instance in before block due to faster scrypt alg
            });

            assert.strictEqual(brambl.networkPrefix, "private", "network prefix is private");
        });
        it('should fail is trying to set network prefix outside of constructor', async () => {
            const brambl = new BrabmlJS({
                KeyManager: keyMan // use instance in before block
            });

            assert.throws(function() {
                brambl.networkPrefix = "testingNetwork";
            }, Error, 'Error: Invalid private variable access.');
        });
        it('should fail with invalid network prefix', async () => {
            assert.throws(function() {
                const brambl = new BrabmlJS({networkPrefix:"local-test"});
            }, Error, 'Error: Invalid Network Prefix');
        });

        it("should fail if Requests and KeyManager instances NetworkPrefixes don't match", async () => {
            // create KeyManager with 'local' network prefix
            keyManLocal = new KeyManager({
                'password': 'topl_the_world',
                'constants': defaultTestOptions,
                'networkPrefix': "local"
            });

            // create Requests with 'valhalla' network prefix
            requestsValhalla = new Requests("valhalla");

            // blambl should trhow error due to incompatible networks
            assert.throws(function() {
                const brambl = new BrabmlJS({
                    Requests: requestsValhalla,
                    KeyManager: keyManLocal
                });
            }, Error, 'Incompatible network prefixes set for Requests and KeyManager Instances.');
        });

        describe('valid network prefixes', function() {
            function testValidNetworks(test) {
                it('should pass if network prefix is ' + test.name, async () => {
                    const brambl = new BrabmlJS({
                        networkPrefix: test.network,
                        Requests: {
                            url: test.url,
                            apiKey: test.apiKey
                        },
                        KeyManager: {
                            'password': 'topl_the_world',
                            'constants': defaultTestOptions
                        }
                    });
                });
            }
            const validNetworks = ['local', 'private', 'toplnet', 'valhalla', 'hel'];
            let testCases = [
                {"name":"local", "network":"local", "url":"", "apiKey":""},
                {"name":"local | diff url", "network":"local", "url":"http://localhost:9084/", "apiKey":""},
                {"name":"local | diff url | diff apiKey", "network":"local", "url":"http://localhost:9083/", "apiKey":"topl_the_wOOrld"},

                {"name":"private", "network":"private", "url":"", "apiKey":""},
                {"name":"private | diff url", "network":"private", "url":"http://localhost:9084/", "apiKey":""},
                {"name":"private | diff url | diff apiKey", "network":"private", "url":"http://localhost:9083/", "apiKey":"topl_the_wOOrld"},

                {"name":"toplnet", "network":"toplnet", "url":"", "apiKey":""},
                {"name":"toplnet | diff url", "network":"toplnet", "url":"http://localhost:9084/", "apiKey":""},
                {"name":"toplnet | diff url | diff apiKey", "network":"toplnet", "url":"http://localhost:9083/", "apiKey":"topl_the_wOOrld"},

                {"name":"valhalla", "network":"valhalla", "url":"", "apiKey":""},
                {"name":"valhalla | diff url", "network":"valhalla", "url":"http://localhost:9084/", "apiKey":""},
                {"name":"valhalla | diff url | diff apiKey", "network":"valhalla", "url":"http://localhost:9083/", "apiKey":"topl_the_wOOrld"},

                {"name":"hel", "network":"hel", "url":"", "apiKey":""},
                {"name":"hel | diff url", "network":"hel", "url":"http://localhost:9084/", "apiKey":""},
                {"name":"hel | diff url | diff apiKey", "network":"hel", "url":"http://localhost:9083/", "apiKey":"topl_the_wOOrld"},
            ];

            testCases.forEach((test) => {
                testValidNetworks(test);
            });
        });

        //test adding keymanager module details
        //test adding requests module details

    });
});
