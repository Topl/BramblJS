/**
 * @fileOverview Unit testing for KeyManager Module
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @date 2020.12.14
 *
 */

const KeyManager = require("../../src/modules/KeyManager");
const assert = require("assert");
const chai = require('chai');
const expect = chai.expect;
const fs = require("fs");

/* -------------------------------------------------------------------------- */
/*                          KeyManager unit tests                             */
/* -------------------------------------------------------------------------- */
describe("KeyManager", () => {
    // run this before all tests
    before(() => {
        keyMan = new KeyManager('password_test');

        // decrease scrypt.n to 2^12 to speed up the tests
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
              n: Math.pow(2, 12), // cost (as given in bifrost)
              r: 8, // blocksize
              p: 1 // parallelization
            }
          };
    });

    // run this before every test
    beforeEach(() => {
    });

    // run this after every test
    afterEach(() => {
    });

    /* ---------------------------- KeyManager Constructor Tests -------------------------------- */
    describe('new keymanager()', function() {
        //test passing optional params to new keymanager constructor
        //todo: remove utils from keymanager module
        //todo: remove callbacks from utils
        //

        /* ---------------------------- invalid passwords -------------------------------- */
        describe('invalid passwords', function() {
            function testInvalidPasswords(test) {
                it('should fail if password is ' + test.it, async () => {
                    assert.throws(function() { new KeyManager(test.value) }, Error, 'Error: A password must be provided at initialization');
                });
            }

            let testCasess = [
                {"it":"123", "value":123},
                {"it":"[]", "value":[]},
                {"it":"{}", "value":{}},
                {"it":"5.12", "value":5.12},
                {"it":"[[]]", "value":[[]]},
                {"it":"undefined", "value":undefined},
                {"it":"{password:123}", "value":{password:123}},
                {"it":"{password:[]}", "value":{password:[]}},
                {"it":"{password:undefined}", "value":{password:undefined}},
                {"it":"{invalidPasswordKey:'invalidKey'}", "value":{invalidPasswordKey:"invalidKey"}}
            ];

            testCasess.forEach((test) => {
                testInvalidPasswords(test);
            });
        });

        /* ---------------------------- valid passwords -------------------------------- */
        describe('generate key w/ valid password', function() {
            function testGenerateKey(test) {
                it('should generate key using password ' + test.it, async () => {
                    let keyMan = new KeyManager({
                        'password':test.value,
                        'constants': defaultTestOptions
                    });
                    expect(keyMan).to.have.property('pk');
                });
            }

            let testCasess = [
                {"it":"passwordtest", "value":"passwordtest"},
                {"it":"this_is_a_password", "value":"this_is_a_password"},
                {"it":"!@#$%^&*(_special_@#$2021", "value":"!@#$%^&*(_special_@#$2021"}
            ];

            testCasess.forEach((test) => {
                testGenerateKey(test);
            });
        });
        describe('generate key w/ keypath', function() {
            function testKeyCreationFromPath(test) {
                it('should instantiate using keyPath ' + test.it, (done) => {
                    // create test key
                    let keyMan = new KeyManager({
                        'password':test.value,
                        'constants': defaultTestOptions
                    });
                    expect(keyMan).to.have.property('pk');

                    // create testing_dir
                    const path = ".keyfiles/.keyfiles_" + new Date().toISOString();
                    fs.mkdirSync(path); // client must create dir

                    // export key to file using the path above
                    let keyfilePath = keyMan.exportToFile(path);
                    assert.strictEqual(keyfilePath.constructor, String, "Key file path is a String");

                    // verify file was stored properly by accessing it
                    fs.access(keyfilePath, fs.F_OK, (err) => {
                        if(err){
                            done(new Error("Error in file creation: " + err));
                        } else {

                            // create new key using path
                            let keyManTest = new KeyManager({
                                'keyPath':keyfilePath,
                                'password':test.value,
                                'constants': defaultTestOptions
                            });
                            expect(keyManTest).to.have.property('pk');
                            assert.strictEqual(keyManTest.pk, keyMan.pk, "Public keys must be the same");

                            // test cleanup
                            fs.rmdirSync(path, { recursive: true });
                            done();
                        }
                    });
                });
            }

            let testCasess = [
                {"it":"this_is_a_password", "value":"this_is_a_password"},
                {"it":"!@#$%^&*(_special_@#$2021", "value":"!@#$%^&*(_special_@#$2021"}
            ];
            testCasess.forEach((test) => {
                testKeyCreationFromPath(test);
            });

        });
    });

    /* ---------------------------- lock key -------------------------------- */
    describe('lockKey()', function() {
        it('should pass if lockKey getter returns boolean', async () => {
            assert.strictEqual(typeof keyMan.isLocked, "boolean", "lockKey getter returns boolean");
        });
        it('should fail if lockKey setter called', async () => {
            assert.throws(function() {
                keyMan.isLocked = false;
            }, Error, 'Error: Invalid private variable access, use lockKey() instead.');
        });
        it('should lock key', async () => {
            keyMan.lockKey();
            assert.strictEqual(keyMan.isLocked, true, "Key is locked");
        });
        it('should fail to unlock key with invalid password', async () => {
            // lock key
            keyMan.lockKey();

            // call unlockKey() without a valid password
            assert.throws(function() {
                keyMan.unlockKey();
            }, Error, 'Error: Invalid password');
        });
        it('should fail to unlock key with invalid password', async () => {
            // lock key
            keyMan.lockKey();

            // call unlockKey() without a valid password
            assert.throws(function() {
                keyMan.unlockKey("this_is_an_invalid_password");
            }, Error, 'Error: Invalid password');
        });
        it('should unlock key with valid password', async () => {
            keyMan.lockKey();
            assert.strictEqual(keyMan.isLocked, true, "Key is locked");

            // unlock key with the correct password
            keyMan.unlockKey('password_test');
            assert.strictEqual(keyMan.isLocked, false, "Key is unlocked");
        });
        it('should throw error if key already unlocked', async () => {
            keyMan.lockKey();
            assert.strictEqual(keyMan.isLocked, true, "Key is locked");

            // unlock key with the correct password
            keyMan.unlockKey('password_test');
            assert.strictEqual(keyMan.isLocked, false, "Key is unlocked");

            // attempt to unlock again
            assert.throws(function() {
                keyMan.unlockKey('password_test');
            }, Error, 'Error: The key is already unlocked');
        });
    });

    /* ---------------------------- get key storage -------------------------------- */
    describe('getKeyStorage()', function() {
        it('should pass if key is unlocked', async () => {
            // key is unlocked by default
            let keyStorage = keyMan.getKeyStorage();

            assert.strictEqual(typeof keyStorage, "object");
            expect(keyStorage).to.have.property('publicKeyId');
            expect(keyStorage).to.have.property('crypto');
        });
        it('should fail if key is locked', async () => {
            // lock key
            keyMan.lockKey();

            // attempt to get keyStorage when locked
            assert.throws(function() {
                keyMan.getKeyStorage();
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
    });

    /* ---------------------------- sign -------------------------------- */
    describe('sign()', function() {
        it('should fail if key is locked', async () => {
            // lock key
            keyMan.lockKey();

            // attempt to sign when key is locked
            assert.throws(function() {
                keyMan.sign("topl_signature");
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
        it('should fail if message is empty', async () => {
            // ensure key is properly unlocked
            keyMan.lockKey();
            keyMan.unlockKey("password_test");

            // attempt to sign with invalid message
            assert.throws(function() {
                keyMan.sign("");
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
        it('should fail if message is not a string', async () => {
            // ensure key is properly unlocked
            keyMan.lockKey();
            keyMan.unlockKey("password_test");

            // attempt to sign with invalid message
            assert.throws(function() {
                keyMan.sign([]);
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
        it('should padd if message is a string', async () => {
            // ensure key is properly unlocked
            keyMan.lockKey();
            keyMan.unlockKey("password_test");

            // sign with invalid message
            let signedKey = keyMan.sign("topl_valid_msg");
            assert.strictEqual(typeof signedKey, "object");
            assert.strictEqual(signedKey.constructor, Uint8Array);
            assert.strictEqual(signedKey.length, 64);
        });
    });

    /* ---------------------------- export to file -------------------------------- */
    describe('exportToFile()', function() {
        let keyMan = new KeyManager('password_test');

        it('should fail if key is locked', () => {
            // ensure key is properly unlocked
            keyMan.lockKey();

            // attempt to sign when key is locked
            assert.throws(function() {
                keyMan.exportToFile();
            }, Error, 'The key is currently locked. Please unlock and try again.');
        });
        it('should fail if keypath param is []', () => {
            // ensure key is properly unlocked
            keyMan.unlockKey("password_test");

            // export using an invalid keypath
            assert.throws(function() {
                keyMan.exportToFile([]);
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
        it('should fail if keypath param is {"keyPath":"invalid key"}', () => {
            // export using an invalid keypath
            assert.throws(function() {
                keyMan.exportToFile({"keyPath":"invalid key"});
            }, Error, 'Error: Key manager is currently locked. Please unlock and try again.');
        });
        it('should pass if keypath param not provided', (done) => {
            // export key to file using default "keyfiles/ dir"
            let keyfilePath = keyMan.exportToFile();
            assert.strictEqual(keyfilePath.constructor, String, "Key file path is a String");

            // verify file was stored properly by accessing it
            fs.access(keyfilePath, fs.F_OK, (err) => {
                if(err){
                    done(new Error("Error in file creation: " + err));
                } else {
                    // cleanup exported keyfiles as tests
                    fs.unlinkSync(keyfilePath);
                    done();
                }
            });
        });
        it('should pass if dir .keypath exists', (done) => {
            // create testing_dir
            const path = ".keyfiles/.keyfiles_" + new Date().toISOString();
            fs.mkdirSync(path); // client must create dir

            // export key to file using the path above
            let keyfilePath = keyMan.exportToFile(path);
            assert.strictEqual(keyfilePath.constructor, String, "Key file path is a String");

            // verify file was stored properly by accessing it
            fs.access(keyfilePath, fs.F_OK, (err) => {
                if(err){
                    done(new Error("Error in file creation: " + err));
                } else {
                    // test cleanup
                    fs.rmdirSync(path, { recursive: true });
                    done();
                }
            });
        });
        it('should pass if dir .keypath exists', (done) => {
            // create testing_dir
            const path = ".keyfiles/.keyfiles_" + new Date().toISOString();
            fs.mkdirSync(path); // client must create dir

            // export key to file using the path above
            let keyfilePath = keyMan.exportToFile(path);
            assert.strictEqual(keyfilePath.constructor, String, "Key file path is a String");

            // verify file was stored properly by accessing it
            fs.access(keyfilePath, fs.F_OK, (err) => {
                if(err){
                    done(new Error("Error in file creation: " + err));
                } else {
                    // test cleanup
                    fs.rmdirSync(path, { recursive: true });
                    done();
                }
            });
        });

        /* ------------------------- export to file success tests ----------------------------- */
        let counter = 0;
        let path = ".keyfiles/.keyfiles_" + new Date().toISOString();
        let testCasess = [
            path + counter++,
            path + counter++,
            path + counter++,
            path + counter++,
            path + counter++
        ];
        function testExportKeyfiles(exportPath) {
            it('should pass with path' + exportPath, () => {
                // export key to file using the path above
                let keyfilePath = keyMan.exportToFile(exportPath);
                assert.strictEqual(keyfilePath.constructor, String, "Key file path is a String");

                fs.access(keyfilePath, fs.F_OK, (err) => {
                    if(err){
                        throw new Error("Error in file creation: " + err);
                    } else {
                        // test cleanup
                        fs.rmdirSync(exportPath, { recursive: true });
                    }
                });
            });
        }

        testCasess.forEach((test) => {
            // mkdir if .keyfiles/ dir doesn't exist
            if (!fs.existsSync('.keyfiles')){
                fs.mkdirSync('.keyfiles');
            }
            // mkdir if keypath dir doesn't exist
            if (!fs.existsSync(test)){
                fs.mkdirSync(test);
            }
            testExportKeyfiles(test);
        });
    });
});
