![build](https://github.com/Topl/BramblJS/workflows/build/badge.svg?branch=master)
![gh-pages docs](https://github.com/Topl/BramblJS/workflows/gh-pages%20docs/badge.svg?branch=master)
[![npm version](https://badge.fury.io/js/brambljs.svg)](https://badge.fury.io/js/brambljs)


A NodeJS library to facilitate interaction with the Topl blockchain network. This server-side SDK is compliant with the Dion version of the Topl protocol as defined by the reference implementation, [Bifrost client](https://github.com/topl/bifrost).

# Installation
To install from npm run ``npm install --save brambljs`` in your project directory.<br/>

To install from source:
- Git clone using ``git clone https://github.com/topl/BramblJS``
- Run `npm install` within the cloned repo to install all dependencies

</br>

# Usage

## BramblJS Library
A helper library for interacting with the Topl protocol. Requests to the API layer of a chain provider conform to JSON-RPC standards and are managed by the Requests module. Key Management conforms to the Dion specification of the Topl protocol as implemented in the reference client Bifrost v1.3.

### BramblJS provides the following modules:
* `Brambl` - primary module that provides high-level capabilities and access to Requests, KeyManager, Hash and Address.
* `Requests` - sub-module for sending json-rpc requests to a specified chain provider.
* `KeyManager` - sub-module that provides functions for creating, importing, and exporting Bifrost compatible keyfiles.
* `Hash` - utility to recreates hashes calculated in Bifrost
* `Address` - utility to validate Addresses

A brief overview of each module is given below but for a detailed descriptions of all available methods, please visit https://brambljs.docs.topl.co

</br>

## Brambl Module
### 1a. To create a minimal instance of BramblJS in your application, include the following commands:
```
const BramblJS = require('brambljs');
const brambl = new BramblJS('YOUR_PASS')
```
This will create a new `Requests` instance targetting a `private` node running at `http://localhost:9085`, default api-key `topl_the_world!` and generate a new `KeyManager` instance for signing transactions, using Curve25519 and encrypted with `YOUR_PASS`
</br></br>

### 1b. Set a different network, url and api key
_Required: networkPrefix, password, url, apiKey_
```
const BramblJS = require('brambljs');
const brambl = new BramblJS({
    networkPrefix: "private", // applies to Requests and KeyManager
    password: "topl_the_world!",
    Requests: {
        url: "http://localhost:9085", // set url
        apiKey: "YOUR_API_KEY" // set api key for network
    }
    });
```
</br>

### 1c. Create instances of type KeyManager and Requests and include them as parameters for Brambl
_Required: networkPrefix, password, url, apiKey_
```
const BramblJS = require('brambljs');
const keyManager = BramblJS.KeyManager({
    networkPrefix: "private", // network prefix is required
    password: "topl_the_world!"
});
const requests = BramblJS.Requests("private", "http://localhost:9085", "YOUR_API_KEY");

// network prefix is required and must match the networkPrefix for requests and keyManager
const brambl = new BramblJS({
    networkPrefix: "private",
    KeyManager: keyManager,
    Requests: requests
    });
```
</br>

## Requests Module
The `Requests` module is compliant with Bifrost's JSON-RPC interface documented at https://topl-rpc.docs.topl.co<br/>
A new JSON-RPC interface class may be instantiated by:<br/>
```
const requests = BramblJS.Requests("private", "http://localhost:9085", "YOUR_API_KEY");
```
Update the 'url' for requests instance:
```
requests.setUrl("http://test.url.net:7091");
```
Update the 'api-key' for requests instance
```
requests.setApiKey("YOUR_NEW_KEY");
```
Making Requests using this module directly:
```
requests.getLatestBlock().then(console.log).catch(console.error)
```
Requests can also be done through Brambl module:
```
brambl.requests.getLatestBlock().then(console.log).catch(console.error)
```
By default, requests will be sent to ``http://localhost:9085`` unless a new URL was provided.This is the standard address and API port that Bifrost listens on when launched locally. All of the methods available in this module are asynchronous and will return `Promises` that must be handled using `async/await` structures or `.then()`.
</br>
_Note: All Requests can be called directly using this module or Brambl Module. Details for every request can be found here: https://brambljs.docs.topl.co/Requests.html_

</br>

### Brambl-layer API key protection
By default, Bifrost uses an API key of ``topl_the_world!`` to validate requests on locally running test nets. If you are planning to use the Topl Torus service for servicing API requests, you will need to register for an API key from Torus and subsequently use this value in the constructor of the Brambl layer object. Standard best practices for protecting API keys should be followed in this case (i.e. saving variables in .ENV or config files that are not shared with version control).

</br>

## KeyManager
The `KeyManager` module is compliant with Bifrost's Gjallarhorn Key Manager service and provides an straightforward interface for creating new keyfiles as well as creating and verifying signatures on transactions. New encrypted keyfiles are generated using Curve25519 key pairs and are encrypted using an AES-256 cipher with a user-specified password. All data within the keyfile is encoded using Base58.
<br/><br/>

### 1a. A new `KeyManager` may be created directly using
```
const keyManager = BramblJS.KeyManager("PASSWORD");
```
_Note: `'PASSWORD'` is the user provided encryption password for the keyfile._

### 1b. A new `KeyManager` may be created for a different network
```
const keyManager = BramblJS.KeyManager({ password: "PASSWORD", networkPrefix: "private"});
```

### 1c. A new `KeyManager` can be created by importing a keyfile
```
const myKeyPath = ".keyfiles/my-keyfile.json";
const keyManager = BramblJS.KeyManager({ password: "PASSWORD", keyPath: myKeyPath});
```
_Note: The network prefix will be determined from the address of the keyfile._

### 2. Other functions include:
```
// get key storage
keyMan.getKeyStorage();

// export to file
let dirPath = "../keyfiles-sample-dir"
keyMan.exportToFile(dirPath); // defaults to ./.keyfiles

// check if key is locked
const isLocked = keyMan.isLocked;

// lock key
keyMan.lockKey();

// unlock key
keyMan.unlockKey("PASSWORD");

// retrieve public key
const pk = keyMan.pk;

// retrieve address
const address = keyMan.address;

// retrieve networkPrefix
const networkPrefix = keyMan.networkPrefix;

// sign
let signedKey = keyMan.sign("TOPL_VALID_MSG");
console.log(signedKey);
```
<br/><br/>

# Examples

### Transactions may be issued using the method `brambl.transaction` following instantiation of the class.
In summary, a transaction is implemented by:
  1. Requesting a prototype transaction from a specified network provider (i.e Topl Torus service or local private testnet)
  2. Signing the raw transaction bytes using the keyfile in the `KeyManager` instance.
  3. Sending the fully formed transaction to the `broadcastTx` method available in the `Requests` module.

After issuance, the `pollTx` method may be used to begin polling the chain provider to determine the status of the newly issued transaction.

Below are examples for using the BramblJS library with a private testnet running on your localhost. Please consult the [Bifrost documentation](https://github.com/topl/bifrost) for further instructions on deploying a local private testnet.
<br/><br/>

### REQUIRED: Create a Brambl Instance (see above for more options)
```
const BramblJS = require('brambljs');
const brambl = new BramblJS('YOUR_PASS')
```

### Retrieving the timestamp of the `latest block`
```
brambl.requests.getLatestBlock().then(res => {
        const timestamp = new Date(res.result.bestBlock.header.timestamp);
        const blockHeight = res.result.bestBlock.header.height;
        console.log('Block #' + blockHeight + ' forged ' + timestamp);
    })
```

### Create an new AssetCode to be used in `Create Raw Asset` Transactions
```
// short name must be latin1 enconded, up to 8 chars long.
// the key and the network prefix used to instantiate brambl will be used.
const assetCode = brambl.createAssetCode("name1234");
```
```
// The following can be used to access the utility function directly, this is independent to Brambl instance.
const assetCode = brambl.utils.Address.createAssetCode(networkPrefix, address, shortName);
```

### Issuing a `Create Raw Asset` transaction amd Polling Tx
```
// Create Raw Asset Transfer and sign Tx
const address = brambl.keyManager.address;

const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    // basic: [address, quantity]
    // advance: [address, quantity, securityRoot, metadata]
    [address, 4],
    [address, 2],
  ],
  "assetCode": assetCode,
  "sender": [address],
  "changeAddress": address,
  "minting": true,
  "fee": 1
};

brambl.transaction('createRawAssetTransfer', rawAssetParams)
  .then(res => { console.log('Unconfirmed transaction'); console.log(res); return res })
    .then(res => brambl.pollTx(res.result.txHash))
    .then(res => { console.log('\nConfirmed transaction'); console.log(res) })
    .catch(console.log)
```

### Issuing a `Create Raw Arbit` transaction
```
// Create Raw Arbit Transfer and sign Tx
const address = brambl.keyManager.address;

const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    [address, 2]
  ],
  "sender": [address],
  "changeAddress": address,
  "consolidationAddress": address,
  "fee": 1,
  "data": "",
};

brambl.transaction('createRawArbitTransfer', rawAssetParams)
  .then(res => { console.log('Unconfirmed transaction'); console.log(res); return res })
    .then(res => brambl.pollTx(res.result.txHash))
    .then(res => { console.log('\nConfirmed transaction'); console.log(res) })
    .catch(console.log)
```

### Issuing a `Create Raw Poly` transaction
```
// Create Raw Poly Transfer and sign Tx
const address = brambl.keyManager.address;

const rawAssetParams = {
  "propositionType": "PublicKeyCurve25519",
  "recipients": [
    [address, 2]
  ],
  "sender": [address],
  "changeAddress": address,
  "fee": 1,
  "data": "",
};

brambl.transaction('createRawPolyTransfer', rawAssetParams)
  .then(res => { console.log('Unconfirmed transaction'); console.log(res); return res })
    .then(res => brambl.pollTx(res.result.txHash))
    .then(res => { console.log('\nConfirmed transaction'); console.log(res) })
    .catch(console.log)
```


### Lookup Balances By Address
```
const addresses = ["AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos", "AUAftQsaga8DjVfVvq7DK14fm5HvGEDdVLZwexZZvoP7oWkWCLos"];
brambl.requests.lookupBalancesByAddresses({addresses: addresses})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
```

### Get Mempool
```
brambl.requests.getMempool()
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
```

### Get Tx By Id
```
brambl.requests.getTransactionById({transactionId: "me5cR4imXjssQsB47sKfaAgciYvYrHZCF6J"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
```

### Get Tx from Mempool
```
brambl.requests.getTransactionFromMempool({transactionId: "me5cR4imXjssQsB47sKfaAgciYvYrHZCF6J"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
```

### Get Block by Id
```
brambl.requests.getBlockById({blockId: "wL12me5cR4imXjssQsB47sKfaAgciYvYrHZCF6JN8v1o"})
  .then((res) => console.log(res))
  .catch((e) => console.error(e));
```

### Get Block by Height
```
brambl.requests.getBlockByHeight({"height": 3})
.then((res) => console.log(res))
.catch((e) => console.error(e));
```
<br/>

# Testing
* Run linter before committing any code or creating a PR: `npm run lint`
* You can easily apply some fixes (make sure you review them after): `npm run lint:fix`
* Run only unit tests (uses mocha, chai and sinon): `npm run test:ut`
* Run only end to end (e2e) tests (uses mocha, chai): `npm run test:e2e`
* Run both unit testing and linter: `npm run test`
* Run all tests: `npm run test:all`

<br/>

# License
BramblJS is licensed under the [Mozilla Public License version 2.0 (MPL 2.0)](https://www.mozilla.org/en-US/MPL/2.0). A copy of this license may be found [here](../LICENSE.md)
