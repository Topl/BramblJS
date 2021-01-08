/**
 * @fileOverview Unit testing for Brambl Module
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2021.01.05
 *
 */

const BrabmlJS = require("../../src/Brambl");

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
        it('should pass with empty params obj', async () => {
            const brambl = new BrabmlJS("test");
        });
        it('should fail with empty network prefix', async () => {
            assert.throws(function() {
                const brambl = new BrabmlJS({networkPrefix:""});
            }, Error, 'Error: Invalid Network Prefix');
        });
        it('should fail with invalid network prefix', async () => {
            assert.throws(function() {
                const brambl = new BrabmlJS({networkPrefix:"local-test"});
            }, Error, 'Error: Invalid Network Prefix');
        });

        //RA: TODO - reduce the time for keymanager encryptions during testing...
        describe('valid network prefixes', function() {
            function testValidNetworks(test) {
                it('should pass if network prefix is ' + test.it, async () => {
                    const brambl = new BrabmlJS({
                        networkPrefix : test.value,
                        KeyManager: {
                            password: "topl_the_world"
                            // keyPath: './keystore/itGuy.json'
                        }
                    });
                });
            }
            const validNetworks = ['local', 'private', 'toplnet', 'valhalla', 'hel'];
            let testCasess = [
                {"it":"local", "value":"local"},
                {"it":"private", "value":"private"},
                {"it":"toplnet", "value":"toplnet"},
                {"it":"valhalla", "value":"valhalla"},
                {"it":"hel", "value":"hel"}
            ];

            testCasess.forEach((test) => {
                testValidNetworks(test);
            });
        });

        //test adding keymanager module details
        //test adding requests module details

    });
});
