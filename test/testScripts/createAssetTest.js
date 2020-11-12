const BramblJS = require('../../index')
require('dotenv').config()

const brambl = new BramblJS('test');
const bramblLayer = BramblJS.Requests();

/**
 * If no keys exist under dir keystore, run testScripts/keyManagerTest.js
 * copy the name of one of those newly created keys for keyPath json
 */
const keyMan = BramblJS.KeyManager( { keyPath: 'keystore/2020-11-10T21-57-41.866Z-7a2q8MWdVFK1r4sbn49V8SVfvEygDxPXeT1SeZHAgXTE.json' , password: 'genesis_test_password' });
console.log("KeyManager instance created successfuly.");

// Sign a prototype transaction and broadcast to a chain provider
const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

const createParams = {
    issuer: keyMan.pk,
    assetCode: "test-" + Date.now(),
    recipient: keyMan.pk,
    amount: 1,
    fee: 0
};


bramblLayer.createAssetsPrototype(createParams)
    .then(res => signAndBroadcastPromise(res.result))
    .then(res => console.log(res))
