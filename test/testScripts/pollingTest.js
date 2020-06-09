require('./node_modules/dotenv').config();
const BramblJS = require('../../index');

const brambl = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'genesis',
    },
});

const createParams = {
    issuer: brambl.keyManager.pk,
    assetCode: 'test-' + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0,
};
// console.log(brambl)
// console.log(brambl.transaction)
brambl
    .transaction('createAssetsPrototype', createParams)
    .then((res) => {
        console.log('Unconfirmed transaction');
        return res;
    })
    .then((res) => brambl.pollTx(res.result.txHash))
    .then((res) => {
        console.log('\nConfirmed transaction');
        console.log(res);
    })
    .catch(console.log);
