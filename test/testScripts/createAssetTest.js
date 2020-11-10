const BramblJS = require('../../index')
require('dotenv').config()

const brambl = new BramblJS('test')
const bramblLayer = BramblJS.Requests()
const keyMan = BramblJS.KeyManager( { keyPath: './keystore/itGuy.json' , password: 'genesis' })
const signAndBroadcast = (tx) => BramblJS.utils.transactions.signAndBroadcast(bramblLayer, keyMan, tx)

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