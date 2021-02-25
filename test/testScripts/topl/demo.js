// Must include the following
const KeyManager = require("../../../src/modules/KeyManager");

// Option 1 - create new key manager by passing password | defaults to "private" network
//const keyManager = new KeyManager("topl_the_world!");

// Option 2 - create new key manager by passing password and setting a different network
// TODO: must define all options for networks
//const keyManager = new KeyManager({ password: "topl_the_world!", networkPrefix: "private"});
const keyPath = "./keystore/itGuy.json";
const keyManager = new KeyManager({ password: "foo", keyPath: keyPath});
console.log(keyManager.address)

let dirPath = "./keystore"
keyManager.exportToFile(dirPath); // defaults to ./.keyfiles
