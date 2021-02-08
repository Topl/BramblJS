const blake = require("blake2");
const crypto = require("crypto");
const Base58 = require("base-58");
const keccakHash = require("keccak");
const curve25519 = require("curve25519-js");





const Brambl = require("../../../src/Brambl");
// require("dotenv").config();

const Requests = require("../../../src/modules/Requests");
const requests = new Requests("private");

const KeyManager = require("../../../src/modules/KeyManager");
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



// Sign a prototype transaction and broadcast to a chain provider
//const brambl = new Brambl({networkPrefix:"private", password:"topl_the_world!"});
//const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

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

// requests.createRawAssetTransfer(rawAssetParams)
//   .then((res) => signAndBroadcastPromise(res.result))
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

/* ---------------------- Export Key to File ------------------------ */
//brambl.keyManager.exportToFile();


/* ---------------------- Get Block by Id ------------------------ */
// brambl.requests.getBlockById({blockId: "wL12me5cR4imXjssQsB47sKfaAgciYvYrHZCF6JN8v1o"})
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));

/* ---------------------- Get Block by Height ------------------------ */
// brambl.requests.getBlockByHeight({"height": 3})
// .then((res) => console.log(res))
// .catch((e) => console.error(e));


/* ---------------------- Import Keyfile from BramblSc ------------------------ */
// brambl.requests.getBlockByHeight({"height": 3})
// .then((res) => console.log(res))
// .catch((e) => console.error(e));

//3001e0f1a6de16c0141ffba5ded29174dbe3bd5ccbe46aba92837aa000080f75ff8ce012c306
//30 01 e0f1a6de16c0141ffba5ded29174dbe3bd5ccbe46aba92837aa000080f75ff8c e012c306
// pk: G963TdW4nDwswGa84NNPUzNhxhSkAeyrRvDyJshy6DGo

const brsc = ".keyfiles/brambl-sc-key1.json";
const brbi = ".keyfiles/brambl-bifrost-key1.json";
const brjs = '.keyfiles/2021-02-08T22-40-21.175Z-618wxiUxPqjmU9Qn7YwJao8etb6Cz9XSTkvPCjiXNMME.json'

// let keyManTest = new KeyManager({
//   'keyPath': brsc,
//   'password': "tmp",
//   'networkPrefix': "local"
// });

/**
keysBuffer1: <Buffer b8 d8 3e 89 d4 53 17 1d 18 c8 89 61 08 02 4d fe d0 15 f9 70 65 89 f0 00 db 93 ce e6 34 7d bd 4e>
keysBuffer2: <Buffer 9f d1 ee bf 02 0e 7f 8c 96 49 1a a6 c8 52 19 fb 87 e0 ab 24 d0 34 21 67 5c d7 3f 25 e7 6f d3 27>
address:
3001 e0f1a6de16c0141ffba5ded29174dbe3bd5ccbe46aba92837aa000080f75ff8c e012c306
 */



// let keyManTest = new KeyManager({
//   'keyPath': brbi,
//   'password': "tmp",
//   'networkPrefix': "private"
// });

let keyManTest2 = new KeyManager({
  'keyPath': brjs,
  'password': "tmp",
  'networkPrefix': "private"
});

// address: AUAVaH15Rw5Yo4QyBdGwdAe4f7Nk3Sm1uoeygwJsyBViLnJeud4E
// 4001 939904d534717c69cfa4e80916fc32d22376c83a1403abdbdd93c976ed612587 85bd6aff
// this.#pk  618wxiUxPqjmU9Qn7YwJao8etb6Cz9XSTkvPCjiXNMME
// this.#pk hash <Buffer 93 99 04 d5 34 71 7c 69 cf a4 e8 09 16 fc 32 d2 23 76 c8 3a 14 03 ab db dd 93 c9 76 ed 61 25 87>
const pk = Base58.decode(keyManTest2.pk);
console.log("this.#pk hash",blake.createHash("blake2b", {digestLength: 32}).update(pk).digest());

// const sk = Base58.decode(keyManTest2.sk);
// console.log("this.#sk hash",blake.createHash("blake2b", {digestLength: 32}).update(sk).digest());

//keyManTest2.exportToFile();


/**  5tN2QmEBfmUwPbWsG1ttAGkwP4KZbw6W58NPonT8KsSB.json
ciphertxt is:  2DqeUi4xGRwfCFkV2PnCPJyZjq9BkiroydwKbMqewhhTAbKnsG7ZjGNbCn1neJKGNGBdnsHTVugrSvvDoCX4pXZ2
MAC is:  DHq1JdHktbcedpz18HqMzS6goXKVeDtTBkpGbtemMN2h
keysBuffer1: <Buffer 50 76 6d d9 4a ba 60 a5 d0 0e 9d cc 38 b6 91 b2 b1 9c 41 44 43 fc 52 d7 10 c1 96 d4 25 a5 09 62>
keysBuffer2: <Buffer 48 97 24 27 60 ca ae 3c 15 6c c5 7d f0 07 83 07 47 15 61 04 46 7e fe 83 f8 8d 79 a6 9a 31 1b 7c>
this.#sk  6R6Mbc77e9gHa2sMST6gmP5LLFMLfXvXXTKbJEnUk6G1
this.#pk  5tN2QmEBfmUwPbWsG1ttAGkwP4KZbw6W58NPonT8KsSB

address:
40 01 4897242760caae3c156cc57df007830747156104467efe83f88d79a69a311b7c 33c31ebc
 *
 */






// PK: e0f1a6de16c0141ffba5ded29174dbe3bd5ccbe46aba92837aa000080f75ff8ce012c306
// PK: G963TdW4nDwswGa84NNPUzNhxhSkAeyrRvDyJshy6DGo
//915df938501f38ab89d0ae4cd1a9f1fad266443f1241fc82284c70734b3d837c80cbb188473e82351c32a3eea77d831ff5fb92acb50604bb509e3715f3f1dbc6



//password in tmp and the network is 'local'

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
