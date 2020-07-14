const brambl = require('../index')
require('dotenv').config()

const bramblLayer = new brambl.Requests()
const keyMan = new brambl.KeyManager( { keyPath: './keystore/itGuy.json' , password: 'genesis' })
const signAndBroadcast = (tx) => brambl.utils.transactions.signAndBroadcast(bramblLayer, keyMan, tx)

const createParams = {
    issuer: keyMan.pk,
    assetCode: "test-" + Date.now(),
    recipient: keyMan.pk,
    amount: 1,
    fee: 0
};

bramblLayer.createAssetsPrototype(createParams)
    .then(res => signAndBroadcast(res.result))
    .then(res => console.log(res))