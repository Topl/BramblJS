const Brambl = require("../../../src/Brambl");
// require("dotenv").config();

const Requests = require("../../../src/modules/Requests");
const requests = new Requests("private");

// const KeyManager = require("../../../src/modules/KeyManager");
// const keyManager = new KeyManager("private");



// my local bifrost is set to Private Network
//AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE
// this is a local network address
//86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz
const rawAssetParams1 = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 4, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3","as"],
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 3, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3"],
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 2]
  ],
  "assetCode": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "minting": true,
  "fee": 1
};

// requests.createRawAssetTransfer(rawAssetParams)
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

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

// requests.createRawPolyTransfer(rawPolyParams)
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

//86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz

const rawArbitParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 10]],
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "consolidationAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "fee": 1,
  "data": ""
};

// requests.createRawArbitTransfer(rawArbitParams)
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));




//for 
  //securityRoot : base58 enconded string  [32 bytes]   hash output of blake2b
  //metadata : 128 byte string UTF8

//make asset and tag asset
// metadata is an davanced feature




// requests.getLatestBlock()
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));


  //blockID vLaNRGVjCMJR6yXoxzq5UXwzioKBSjiDasGCZD7iFRTw



// requests.lookupBalancesByKey({addresses:["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"]})
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));


// requests.getMempool()
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));


//const keyManager = BramblJS.KeyManager();
//const keyMan = new KeyManager({networkPrefix:"private", password:"topl_the_world!"});

// [keyManager.pk, 4, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3","as"],
//     [keyManager.pk, 3, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3"],

const brambl = new Brambl({networkPrefix:"private", password:"topl_the_world!"});

// Sign a prototype transaction and broadcast to a chain provider
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

requests.createRawAssetTransfer(rawAssetParams)
  .then((res) => signAndBroadcastPromise(res.result))
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
