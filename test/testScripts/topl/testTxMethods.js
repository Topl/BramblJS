const Brambl = require("../../../src/Brambl");
// require("dotenv").config();

const Requests = require("../../../src/modules/Requests");
const requests = new Requests("private");

// const KeyManager = require("../../../src/modules/KeyManager");
// const keyManager = new KeyManager("private");


/* ---------------------- Create Raw Asset Trasfer ------------------------ */
// my local bifrost is set to Private Network:
//AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE
// this is a local network address:
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
/**
 * for
  securityRoot : base58 enconded string  [32 bytes]   hash output of blake2b
  metadata : 128 byte string UTF8

  make asset and tag asset
  metadata is an davanced feature
 */

// requests.createRawAssetTransfer(rawAssetParams)
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));


/* ---------------------- Create Raw Poly Trasfer ------------------------ */
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

/* ---------------------- Create Raw Arbit Trasfer ------------------------ */
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


/* ---------------------- Get Latest Block ------------------------ */
// requests.getLatestBlock()
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

/* ---------------------- Lookup Balances By Key ------------------------ */
// requests.lookupBalancesByKey({addresses:["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"]})
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

/* ---------------------- Get Mem Pool ------------------------ */
// requests.getMempool()
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));


/* ---------------------- Create Asset + Sign and Broadcast Tx ------------------------ */
//const keyManager = BramblJS.KeyManager();
//const keyMan = new KeyManager({networkPrefix:"private", password:"topl_the_world!"});

// [keyManager.pk, 4, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3","as"],
// [keyManager.pk, 3, "5Jrbs2qVvXEtLpshpR7dLsSPmsgJLYU5nUiQftyoZYL3"],

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

/* ---------------------- Export Key to File ------------------------ */
//brambl.keyManager.exportToFile();


  /**
   * 
   * sample using Bifrost key
   * {
  "crypto" : {
    "mac" : "BWce2BZsgD37xXWJrHcBD27sNea3RoFDbAqjEP6tZdmj",
    "kdf" : "scrypt",
    "cipherText" : "3tMNiXDwD8ScHEkLSvPJLE3VBajba8HaFf3QH9VJXFoS94EeEota2XTpYNjCHhFigEHUuXeST8Caz2UC1MXVrpdw",
    "kdfSalt" : "FaDyEtCtrCWnGhdYCA6R4nCtvweitzkNqLXegiv61gaZ",
    "cipher" : "aes-128-ctr",
    "cipherParams" : {
      "iv" : "9Mh54cxRL6V3WW8dUEmuCg"
    }
  },
  "address" : "AUA49tgkkwbEQmp9BKZKr9feYrR1aHYRuy3PgRbKcPhWSKPYkoqB"
}
   */

   /**
    * {
    
    "crypto": {
      "mac": "9wGhRwvBmnjMNe9wEuzDarg2ftDJUDNjeMtWagqtdTLJ",
      "kdf": "scrypt",
      "kdfSalt": "BNLif6w9SKbwmxGKqY1MxZg7jAWn2TFQ9MLTzx4wZXo6"
      "cipher": "aes-256-ctr",
      "cipherText": "32bYotD2m2tR9BLjSQUG6NVGkYVTm3LKmBHPzHMKKpnmVAtyG5mrHAWNR8VDfyvnw8bZvfL3ipKuxKtNcgS6A2La",
      "cipherParams": {
        "iv": "9P334YkqeegQ1AGx41XjdL"
      }
    },
    "address": "5htj2h3iSVAKkdA783xZmUrvyEfLGt9dDp93pv8keruy"
  }
    */
