require('dotenv').config();
const BramblJS = require('../../index');

const brambl = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'genesis_billyBob',
        //keyPath: './keystore/itGuy.json'
    },
});
console.log(brambl.keyManager);
const createParams = {
    issuer: brambl.keyManager.pk,
    assetCode: 'test-' + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0,
};

brambl.requests
    .createAssetsPrototype(createParams)
    .then((res) => brambl.signAndBroadcast(res.result))
    .then((res) => console.log(res));
