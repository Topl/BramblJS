/* -------------------------------------------------------------------------- */
/*                               Key Manager                                  */
/* -------------------------------------------------------------------------- */

/* ---------------------- Create new Keyfile using KeyManager ------------------------ */
// Must include the following
const KeyManager = require("../../../src/modules/KeyManager");

// Option 1 - create new key manager by passing password | defaults to "private" network
const keyManager = new KeyManager("topl_the_world!");

// Option 2 - create new key manager by passing password and setting a different network
// TODO: must define all options for networks
const keyManager = new KeyManager({ password: "topl_the_world!", networkPrefix: "private"});


/* ---------------------- Import Keyfile using KeyManager ------------------------ */
// Must provide keyPath, password & networkPrefix to properly decrypt
const keyPath = ".keyfiles/2021-02-08T22-40-21.175Z-618wxiUxPqjmU9Qn7YwJao8etb6Cz9XSTkvPCjiXNMME.json";
const keyManager = new KeyManager({ password: "topl_the_world!", networkPrefix: "private", keyPath: keyPath});


/* ---------------------- Advanced: Include diff constants ------------------------ */
const optConstants = {
    // Symmetric cipher for private key encryption
    cipher: "aes-256-ctr",
    // Initialization vector size in bytes
    ivBytes: 16,
    // Private key size in bytes
    keyBytes: 32,
    // Key derivation function parameters
    scrypt: {
      dkLen: 32,
      n: Math.pow(2, 18), // cost (as given in bifrost)
      r: 8, // blocksize
      p: 1 // parallelization
    }
};

const keyManager = new KeyManager({
    password: "topl_the_world!",
    networkPrefix: "private",
    constants: optConstants});


/* ---------------------- Functions ------------------------ */
const KeyManager = require("../../../src/modules/KeyManager");
const keyMan = new KeyManager("topl_the_world!");

// get key storage
keyMan.getKeyStorage();

// sign
let signedKey = keyMan.sign("topl_valid_msg");
console.log(signedKey);

// export to file
let dirPath = "../keyfiles-sample-dir"
keyMan.exportToFile(dirPath); // defaults to ./.keyfiles

// check if key is locked
keyMan.isLocked();

// lock key
keyMan.lockKey();

// unlock key
keyMan.unlockKey(password_dude);

// retrieve public key
keyMan.pk();

// retrieve address
keyMan.address();

// Generate the signature of a message using the provided private key
// optional, it is recommended to use brambl.signAndBroadcast(tx) instead
keyMan.sign(message);

// Create Raw Asset Transfer and sign Tx
const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 2]
  ],
  "assetCode": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",//brambl.keyManager.pk
  "minting": true,
  "fee": 1
};

brambl.requests.createRawAssetTransfer(rawAssetParams)
  .then((res) => signAndBroadcastPromise(res.result))
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* -------------------------------------------------------------------------- */
/*                                Requests                                    */
/* -------------------------------------------------------------------------- */

/* -------------------- Create new Requests Instance ------------------------ */
// Must include the following
const Requests = require("../../../src/modules/Requests");

// Option 1 - create new requests instance by passing the networkPrefix | defaults to "private" network
const requests = new Requests("private");

// Option 2 -
// The networkPrefix must be provided to verify addresses
// Optional url and apiKey can be provided
const requests = new Requests("private", "http://localhost:9085/");
const requests = new Requests("private", "http://localhost:9085/", "topl_the_world!");

// url can be set during instantiation or set using setUrl()
requests.setUrl("http://test.url.net:6969");

// apiKey can be set during instantiation or set using setApiKey()
requests.setApiKey("new_key!");

//TODO: 
requests.createRawAssetTransfer();

requests.createRawPolyTransfer();

requests.createRawArbitTransfer();

requests.getBlockByHeight();



/* -------------------------------------------------------------------------- */
/*                                BramblJS                                    */
/* -------------------------------------------------------------------------- */

/* -------------------- Create new Requests Instance ------------------------ */
const Brambl = require("../../../src/Brambl");

// option 1 - set password to creqte new keyfile with default network "private"
const brambl = new Brambl("topl_the_world!");

// option 2 - set both network Prefix and password to create new keyfile
// this sets both KeyManager and Request to Private Network
const brambl = new Brambl({networkPrefix:"private", password:"topl_the_world!"});

// option 3 - set network Prefix and provide instances of Request and KeyManager
// Note: keyManager, Request and Brambl must be set to the same network
const KeyManager = require("../../../src/modules/KeyManager");
const Requests = require("../../../src/modules/Requests");

const keyManager = new KeyManager({ networkPrefix: "private", password: "topl_the_world!"});
const requests = new Requests("private");

const brambl = new Brambl({networkPrefix:"private", Keymanager: keyManager, Requests: requests});


// option 4 - provide details for KeyManager and Requests inside Brambl constructor
const bramblParams = {
    networkPrefix: "private", // this applies to all
    KeyManager: {
        password: "",// required
        keyPath:"", // optional if trying to import KeyFile
        constants:"" // optional, advanced feature
    },
    Requests: {
        url: "", // optional, include different url used for local | private nets
        apiKey: "" // optional, include api key when used in a private net
    }
};
const brambl = new Brambl(bramblParams);

/* -------------------- get network prefix ------------------------ */
const netpfx = brambl.networkPrefix();

/* -------------------- create new Request instance using Brambl ------------------------ */
const newRequestsObj = brambl.Requests("private", "url", "apiKey");

/* -------------------- create new KeyMan instance using Brambl ------------------------ */
const newRequestsObj = brambl.KeyManager({networkPrefix:"private", password:"pass"});// KeyPath and constants are optional


/* -------------------- sign and broadcast Transaction using Brambl ------------------------ */
const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

const rawAssetParams = {
    "propositionType": "PublicKeyCurve25519",
    "recipients": [
      ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 2]
    ],
    "assetCode": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
    "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
    "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",//brambl.keyManager.pk
    "minting": true,
    "fee": 1
  };

brambl.requests.createRawAssetTransfer(rawAssetParams)
    .then((res) => signAndBroadcastPromise(res.result))
    .then((res) => console.log(res))
    .catch((e) => console.error(e));


/* -------------------------------------------------------------------------- */
/*                             Topl API Routes                                */
/* -------------------------------------------------------------------------- */
const Requests = require("../../../src/modules/Requests");

// option 1 - use Brambl Module
const brambl = new Brambl({networkPrefix:"private", password:"topl_the_world!"});

brambl.requests.getLatestBlock(params)
.then((res) => console.log(res))
.catch((e) => console.error(e));


// option 2 - use the Requests Module
const requestsModule = new Requests("private");

requestsModule.getLatestBlock(params)
.then((res) => console.log(res))
.catch((e) => console.error(e));


/* -------------------- Create Raw Asset Transfer ------------------------ */

const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
    // Advanced feature - Recipients have these 2 options
    // basic: [address, quantity]
    // advance: [address, quantity, securityRoot, metadata]
  "recipients": [
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",4],
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",3]
  ],
  "assetCode": "4Y7EsNHVwiZ488s2uvePrtNBpCFAsK132H7AUq2rxsBkJSJv7oda9yyZgb2",
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "minting": true,
  "fee": 1
};

brambl.requests.createRawAssetTransfer(rawAssetParams)
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* -------------------- Create Raw Poly Transfer ------------------------ */
const rawPolyParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",4],
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",3]
  ],
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "fee": 1
};

brambl.requests.createRawPolyTransfer(rawPolyParams)
  .then((res) => console.log(res))
  .catch((e) => console.error(e));


/* -------------------- Create Raw Arbit Transfer ------------------------ */
const rawArbitParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 10]],
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "consolidationAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "fee": 1,
  "data": ""
};

brambl.requests.createRawArbitTransfer(rawArbitParams)
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* --------------------------------- Get Latest Block --------------------------------------- */
brambl.requests.getLatestBlock()
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* --------------------------------- Lookup Balances By Key --------------------------------------- */
const addresses = ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos", "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos"];
brambl.requests.lookupBalancesByKey({addresses: addresses})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* ---------------------- Get Mempool ------------------------ */
brambl.requests.getMempool()
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* -------------------------- Get Tx By Id ---------------------------- */
brambl.requests.getTransactionById({transactionId: "me5cR4imXjssQsB47sKfaAgciYvYrHZCF6J"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* -------------------------- Get Tx from Mempool ---------------------------- */
brambl.requests.getTransactionFromMempool({transactionId: "me5cR4imXjssQsB47sKfaAgciYvYrHZCF6J"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

  /* ---------------------- Get Block by Id ------------------------ */
brambl.requests.getBlockById({blockId: "wL12me5cR4imXjssQsB47sKfaAgciYvYrHZCF6JN8v1o"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));

/* ---------------------- Get Block by Height ------------------------ */
brambl.requests.getBlockByHeight({"height": 3})
.then((res) => console.log(res))
.catch((e) => console.error(e));

/* -------------------------------------------------------------------------- */
/*                              Address Utils                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------- Validate Addresses ------------------------ */
// const paramObj =
//   {
//     "propositionType": "PublicKeyCurve25519",
//     "changeAddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
//     "consolidationAdddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
//     "recipients": [["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz", 10]],
//     "sender": ["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTs"],
//     "addresses": [],
//     "fee": 1,
//     "data": ""
//   }
// ;

// // extractAddressesFromObj(paramObj);
// const addValidationRes = validateAddressesByNetwork("local", paramObj);
// console.log(addValidationRes);


