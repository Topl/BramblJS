require('dotenv').config()
const BramblJS = require('../../index')

const brambl = new BramblJS({
    // Requests: {
    //     url: 'https://valhalla.torus.topl.co:9585/',
    //     apiKey: process.env.VALHALLA_KEY
    // },
    KeyManager: {
        password: 'genesis',
        // keyPath: './keystore/itGuy.json'
    }
})

const createParams = {
    issuer: brambl.keyManager.pk,
    assetCode: "test-" + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0
};

const int = setInterval(() => { brambl.transaction('createAssetsPrototype', createParams).then(console.log)}, 500)
setTimeout(()=>{
    console.log("clearing generator")
    clearInterval(int)
}, 60000)