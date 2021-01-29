// const BramblJS = require("../../index");
// require("dotenv").config();


const Requests = require("../../../src/modules/Requests");
const requests = new Requests("private");

// my local bifrost is set to Private Network
//AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE
// this is a local network address
//86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz
const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
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


const rawArbitParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE", 10]],
  "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
  "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "consolidationAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
  "fee": 1,
  "data": ""
};

requests.createRawArbitTransfer(rawArbitParams)
  .then((res) => console.log(res))
  .catch((e) => console.error(e));