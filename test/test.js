require('dotenv').config();
const BramblJS = require('../index');

const brambl = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'genesis',
        //keyPath: './keystore/itGuy.json'
    },
});
var Requests = brambl.requests;
console.log('------Requests Object-------');
console.log(Requests);

var KeyManager = brambl.keyManager;
console.log('------KeyManager Object-------');
console.log(KeyManager);
console.log(brambl.keyManager);

console.log(
    'first We will test a whole bunch of in the request object functions. As long as you see no errors your all good',
);
// Transaction Test
const createParams = {
    issuer: brambl.keyManager.pk,
    assetCode: 'test-' + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0,
};
brambl.transaction('createAssetsPrototype', createParams).then(function (response) {
    console.log('----------------------------------------------------------------');
    console.log('Transaction result:');
    console.log(response);
});

// Calculate Delay
Requests.calcDelay({ blockId: '6LPtWEm5CRzcjcqJKym9ByKPRYWvBYy7P3DHeE4K7F2r', numBlocks: 100 }).then(function (
    response,
) {
    console.log('----------------------------------------------------------------');
    console.log('calcDelay result:');
    console.log(response);
});

// Chain Info
Requests.chainInfo().then(function (response) {
    console.log('----------------------------------------------------------------');
    console.log('Chain Info result:');
    console.log(response);
});

// getBalancesByKey Test
Requests.getBalancesByKey({ publicKeys: ['J6j878auHyYTo46zMQekovCT9bGZKPE72cJv8CPHXVGR'] }).then(function (response) {
    console.log('----------------------------------------------------------------');
    console.log('Get Balances By Key result:');
    console.log(response);
});

// Lists Open KeyFiles
Requests.listOpenKeyfiles().then(function (response) {
    console.log('----------------------------------------------------------------');
    console.log('Open Key Files result:');
    console.log(response);
});

// Generate Key File
// Commented out to avoid generating an excessive amounts of key files
Requests.generateKeyfile({ password: 'password' }).then(function (response) {
    console.log('----------------------------------------------------------------');
    console.log('Generate Key Files result:');
    console.log(response);
});

// lock Key File
// Commented to avoid relocking
Requests.lockKeyfile({ password: 'password', publicKey: '6xywd24gtBMVACMz9KqRiAYWCxbVWyZ7CJEyPP1P9CSS' }).then(
    function (response) {
        console.log('----------------------------------------------------------------');
        console.log('Lock Key File result:');
        console.log(response);
    },
);

// unlockKeyfile
// commented to avoid unlocking already unlocked keys
Requests.unlockKeyfile({ password: 'password', publicKey: '5cJ599eLTrdyVdwSStubyyvYdV8L2GRB8DfgwZNz8Ejp' }).then(
    function (response) {
        console.log('----------------------------------------------------------------');
        console.log('unLock Key File result:');
        console.log(response);
    },
);

/////////////////////////////////////
// Key Manager Tests
/////////////////////////////////////

const KeyMan = require('../dist/modules/KeyManager');

h = KeyManager.getKeyStorage();
console.log('-----------------------------');
console.log('Key MAnager STorage');
console.log(h);

sig = KeyManager.sign('this is a msg', Buffer.from);
console.log(sig);
console.log('-----------------------------');
console.log('Veryify Public Key');
ver = brambl.keyMan.verify(h.publicKeyId, 'this is a msg', sig);
console.log(ver);

KeyManager.exportToFile('keystore/');

// /////////////////////////
const gjak = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY,
    },
    KeyManager: {
        password: 'genesis',
    },
});
try {
    gjak.keyManager.sign('this should break');
} catch (err) {
    console.log(err);
}

let outKey = '';
try {
    outKey = brambl.keyManager.exportToFile('keystore/');
    console.log(outKey);
} catch (err) {
    console.log(err);
}

/////////////////////////
try {
    const gjam = new BramblJS({
        Requests: {
            url: 'https://valhalla.torus.topl.co/',
            apiKey: process.env.VALHALLA_KEY,
        },
        KeyManager: {
            password: 'genesis',
            keyPath: outKey,
        },
    });
    console.log('-----------------------------');
    console.log('From Storage File');
    console.log(gjam.keyManager.getKeyStorage());
} catch (err) {
    console.log(err);
}
