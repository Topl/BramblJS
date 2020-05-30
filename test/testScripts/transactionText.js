require('dotenv').config()
const BramblJS = require('../../index')

const brambl = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY
    },
    KeyManager: {
        password: 'genesis_billyBob',
        //keyPath: './keystore/itGuy.json'
    }
})

const createParams = {
    issuer: brambl.keyManager.pk,
    assetCode: "test-" + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0
};

brambl.transaction('createAssetsPrototype', createParams).then(console.log)