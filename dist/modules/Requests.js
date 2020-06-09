'use strict';
/** A Javascript API wrapper module for the Bifrost Protocol.
 * Currently supports version 4.1 of Bifrost's Brambl-Layer API
 * Documentation for Brambl-layer is available at https://Requests.docs.topl.co
 *
 * @author James Ama (j.aman@topl.me)
 * @date 2020.0.29
 *
 * Based on the original work of Yamir Tainwala - 2019
 */
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
('use strict');
// Dependencies
const node_fetch_1 = __importDefault(require('node-fetch'));
/**
 * General builder function for formatting API request
 *
 * @param {object} routeInfo - call specific information
 * @param {string} routeInfo.route - the route where the request will be sent
 * @param {string} routeInfo.method - the json-rpc method that will be triggered on the node
 * @param {string} routeInfo.id - an identifier for tracking requests sent to the node
 * @param {object} params - method specific parameter object
 * @param {object} self - internal reference for accessing constructor data
 * @returnss {object} JSON response from the node
 */
function BramblRequest(routeInfo, params, self) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const route = routeInfo.route;
            const body = {
                jsonrpc: '2.0',
                id: routeInfo.id || '1',
                method: routeInfo.method,
                params: [Object.assign({}, params)],
            };
            const payload = {
                url: self.url + route,
                method: 'POST',
                headers: self.headers,
                body: JSON.stringify(body),
            };
            const response = yield (yield node_fetch_1.default(self.url + route, payload)).json();
            if (response.error) {
                throw response;
            } else {
                return response;
            }
        } catch (err) {
            throw err;
        }
    });
}
/**
 * A function to ensure the parameters object is not empty and has the correct keys.
 * @param {any} params parameter object
 * @param {Array} keysList List of Keys nessesary for the parameter object to include.
 * @class Requests
 */
function checkParams(params, keysList) {
    let desParams = Object.entries(params);
    let structuredArr = [];
    desParams.forEach(function (keyPair) {
        if (keyPair[1] === undefined || keyPair === null) {
            throw new Error('A ' + keyPair[0] + ' key must be specified cant use undefined or null');
        }
        structuredArr.push(keyPair[0]);
    });
    if (!params) {
        throw new Error('A parameter object must be specified');
    } else {
        if (JSON.stringify(keysList.sort()) !== JSON.stringify(structuredArr.sort())) {
            var key = '';
            keysList.forEach(function (keys) {
                key += keys + ', ';
            });
            // console.log(key)
            throw new Error('Make Sure you filling only the correct keys, keys you must fill are ' + key);
        } else {
        }
    }
}
/**
 * A class for sending requests to the Brambl layer interface of the given chain provider
 * @param {string} [url="http://localhost:9085/"] Chain provider location
 * @param {string} [apiKey="topl_the_world!"] Access key for authorizing requests to the client API
 * @class Requests
 */
class Requests {
    constructor(url = 'http://localhost:9085/', apiKey = 'topl_the_world!') {
        this.url = url;
        this.headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        };
    }
    //Allows setting a different url than the default from which to create and accept RPC connections
    setUrl(url) {
        this.url = url;
    }
    setApiKey(apiKey) {
        this.headers['x-api-key'] = apiKey;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////Wallet Api Routes////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////getBalancesByKey/////////////////////
    /**
     * Get the balances of a specified public key in the keyfiles directory of the node
     * @param {Object} params - body parameters passed to the specified json-rpc method
     * @param {string[]} params.publicKeys - An array of public keys to query the balance for
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    getBalancesByKey(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['publicKeys']);
            const route = 'wallet/';
            const method = 'balances';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////listOpenKeyfiles////////////////
    /**
     * Get a list of all open keyfiles
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    listOpenKeyfiles(id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            const route = 'wallet/';
            const method = 'listOpenKeyfiles';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////generateKeyfile////////////////
    /**
     * Generate a new keyfile in the node keyfile directory
     * @param {Object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.password - Password for encrypting the new keyfile
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    generateKeyfile(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['password']);
            const route = 'wallet/';
            const method = 'generateKeyfile';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////lockKeyfile////////////////
    /**
     * Lock an open keyfile
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.publicKey - Base58 encoded public key to get the balance of
     * @param {string} params.password - Password used to encrypt the keyfile
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    lockKeyfile(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['publicKey', 'password']);
            const route = 'wallet/';
            const method = 'lockKeyfile';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////unlockKeyfile////////////////
    /**
     * Unlock a keyfile in the node's keyfile directory
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.publicKey - Base58 encoded public key to get the balance of
     * @param {string} params.password - Password used to encrypt the keyfile
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    unlockKeyfile(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['publicKey', 'password']);
            const route = 'wallet/';
            const method = 'unlockKeyfile';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////signTransaction////////////////
    /**
     * Have the node sign a JSON formatted prototype transaction
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.publicKey - Base58 encoded public key to get the balance of
     * @param {string} params.tx - a JSON formatted prototype transaction
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    signTransaction(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['publicKey', 'tx']);
            const route = 'wallet/';
            const method = 'signTx';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    ///////////broadcastTx////////////////////
    /**
     * Have the node sign a `messageToSign` raw transaction
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.tx - a JSON formatted transaction (must include signature(s))
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    broadcastTx(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['tx']);
            const route = 'wallet/';
            const method = 'broadcastTx';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferPolys////////////
    /**
     * Transfer Polys to a specified public key.
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.recipient - Public key of the transfer recipient
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string|string[]} [params.sender] - Array of public keys which you can use to restrict sending from
     * @param {string} [params.changeAddress] - Public key you wish to send change back to
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferPolys(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'wallet/';
            const method = 'transferPolys';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferArbits////////////
    /**
     * Transfer Arbits to a specified public key.
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.recipient - Public key of the transfer recipient
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string|string[]} [params.sender] - Array of public keys which you can use to restrict sending from
     * @param {string} [params.changeAddress] - Public key you wish to send change back to
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferArbits(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'wallet/';
            const method = 'transferArbits';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////Asset Api Routes/////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////createAssets////////////
    /**
     * Create a new asset on chain
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.issuer - Public key of the asset issuer
     * @param {string} params.assetCode - Identifier of the asset
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    createAssets(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetCode', 'issuer']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be > 0');
            const route = 'asset/';
            const method = 'createAssets';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////createAssetsPrototype////////////
    /**
     * Create a new asset on chain
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.issuer - Public key of the asset issuer
     * @param {string} params.assetCode - Identifier of the asset
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    createAssetsPrototype(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetCode', 'issuer']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be > 0');
            const route = 'asset/';
            const method = 'createAssetsPrototype';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferAssets////////////
    /**
     * Transfer an asset to a recipient
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.issuer - Public key of the asset issuer
     * @param {string} params.assetCode - Identifier of the asset
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string|string[]} [params.sender] - Array of public keys which you can use to restrict sending from
     * @param {string} [params.changeAddress] - Public key you wish to send change back to
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferAssets(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetCode', 'issuer']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'asset/';
            const method = 'transferAssets';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferAssetsPrototype////////////
    /**
     * Transfer an asset to a recipient
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.issuer - Public key of the asset issuer
     * @param {string} params.assetCode - Identifier of the asset
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {string|string[]} params.sender - Array of public keys which you can use to restrict sending from
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string} [params.changeAddress] - Public key you wish to send change back to
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferAssetsPrototype(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetCode', 'issuer']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'asset/';
            const method = 'transferAssetsPrototype';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferTargetAssets////////////
    /**
     * Transfer a specific asset box to a recipient
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {string} params.assetId - BoxId of the asset to target
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferTargetAssets(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetId']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'asset/';
            const method = 'transferTargetAssets';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////transferTargetAssetsPrototype////////////
    /**
     * Get an unsigned targeted transfer transaction
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.recipient - Public key of the asset recipient
     * @param {array} params.sender - Array of public keys of the asset senders
     * @param {string} params.assetId - BoxId of the asset to target
     * @param {number} params.amount - Amount of asset to send
     * @param {number} params.fee - Fee to apply to the transaction
     * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    transferTargetAssetsPrototype(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['amount', 'recipient', 'fee', 'assetId', 'sender']);
            if (!params.fee && params.fee !== 0) throw new Error('A fee must be specified');
            const route = 'asset/';
            const method = 'transferTargetAssetsPrototype';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////NodeView Api Routes//////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////getTransactionById////////////
    /**
     * Lookup a transaction from history by the provided id
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.transactionId - Unique identifier of the transaction to retrieve
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    getTransactionById(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['transactionId']);
            const route = 'nodeView/';
            const method = 'transactionById';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////getTransactionFromMempool////////////
    /**
     * Lookup a transaction from the mempool by the provided id
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.transactionId - Unique identifier of the transaction to retrieve
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    getTransactionFromMempool(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['transactionId']);
            const route = 'nodeView/';
            const method = 'transactionFromMempool';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////getMempool////////////
    /**
     * Return the entire mempool of the node
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    getMempool(id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            const route = 'nodeView/';
            const method = 'mempool';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////////////getBlockById////////////
    /**
     * Lookup a block from history by the provided id
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.blockId - Unique identifier of the block to retrieve
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    getBlockById(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['blockId']);
            const route = 'nodeView/';
            const method = 'blockById';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////Debug Api Routes/////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////Get chain information////////////
    /**
     * Return the chain information
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    chainInfo(id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            var params = {};
            const route = 'debug/';
            const method = 'info';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    ////////////Calculate block delay////////////
    /**
     * Get the average delay between blocks
     * @param {object} params - body parameters passed to the specified json-rpc method
     * @param {string} params.blockId - Unique identifier of a block
     * @param {string} params.numBlocks - Number of blocks to consider behind the specified block
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    calcDelay(params, id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            checkParams(params, ['blockId', 'numBlocks']);
            const route = 'debug/';
            const method = 'delay';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    //////////Blocks generated by node's keys////////////
    /**
     * Return the number of blocks forged by keys held by this node
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    myBlocks(id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            const route = 'debug/';
            const method = 'myBlocks';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
    /////////Map block geneators to blocks////////////
    /**
     * Return the blockIds that each accessible key has forged
     * @param {string} [id="1"] - identifying number for the json-rpc request
     * @returns {object} json-rpc response from the chain
     * @memberof Requests
     */
    blockGenerators(id = '1') {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            const route = 'debug/';
            const method = 'generators';
            return BramblRequest({ route, method, id }, params, this);
        });
    }
}
module.exports = Requests;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
