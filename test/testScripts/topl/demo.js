// // Must include the following
// const KeyManager = require("../../../src/modules/KeyManager");

// // Option 1 - create new key manager by passing password | defaults to "private" network
// //const keyManager = new KeyManager("topl_the_world!");

// // Option 2 - create new key manager by passing password and setting a different network
// //const keyManager = new KeyManager({ password: "topl_the_world!", networkPrefix: "private"});
// const keyPath = "./keystore/itGuy.json";
// const keyManager = new KeyManager({ password: "foo", keyPath: keyPath});
// console.log(keyManager.address)

// let dirPath = "./keystore"
// keyManager.exportToFile(dirPath); // defaults to ./.keyfiles


const BramblJS = require("../../../src/Brambl");

// const keyManager = BramblJS.KeyManager({
//     networkPrefix: "private",
//     password: "topl_the_world!"
// });
// const keyManager2 = BramblJS.KeyManager({
//     networkPrefix: "private",
//     password: "topl_the_world2"
// });
// const requests = BramblJS.Requests(
//     "private",
//     "http://localhost:9085",
//     "topl_the_world!"
// );

const brambl = new BramblJS({
    networkPrefix: "private",
    password: "foo"
    });

    brambl.requests.getLatestBlock().then(res => {
        const timestamp = new Date(res.result.bestBlock.header.timestamp)
        const blockHeight = res.result.bestBlock.header.height
        console.log('Block #' + blockHeight + ' forged ' + timestamp)
    })
    const assetCode = brambl.createAssetCode("SHORT1");

    console.log(assetCode)

    const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

    const address = brambl.keyManager.address;

    const rawAssetParams = {
    "propositionType": "PublicKeyCurve25519",
     // Advanced feature - Recipients have these 2 options
    // basic: [address, quantity]
    // advance: [address, quantity, securityRoot, metadata]
  "recipients": [
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",4],
    ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",3]
  ],
    "assetCode": assetCode,
    "sender": [address],
    "changeAddress": address,
    "minting": true,
    "fee": 1
    };
    console.log(rawAssetParams)

    brambl.transaction('createRawAssetTransfer', rawAssetParams)
    // .then((res) => signAndBroadcastPromise(res.result))
    .then((res) => console.log(res))
    .catch((e) => console.error(e));
    // const signAndBroadcastPromise = (tx) => brambl.signAndBroadcast(tx);

    // const rawAssetParams = {
    //   "propositionType": "PublicKeyCurve25519",
    //   "recipients": [
    //     [keyManager2.address, 2]
    //   ],
    //   "assetCode": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",
    //   "sender": ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE"],
    //   "changeAddress": "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLoE",//brambl.keyManager.pk
    //   "minting": true,
    //   "fee": 1
    // };
    
    // brambl.requests.createRawAssetTransfer(rawAssetParams)
    //   .then((res) => signAndBroadcastPromise(res.result))
    //   .then((res) => console.log(res))
    //   .catch((e) => console.error(e));