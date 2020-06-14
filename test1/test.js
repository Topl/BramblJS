require('dotenv').config();
const BramblJS = require('../dist/Brambl');
const assert = require('assert');

const brambljs = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'password',
        //keyPath: './keystore/itGuy.json'
    },
});
var h = brambljs.keyManager.getKeyStorage();
console.log(h);
