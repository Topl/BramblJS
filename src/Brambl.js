/**
 * @author James Aman (j.aman@topl.me)
 * @author Raul Aragonez (r.aragonez@topl.me)
 * @version 1.0.0
 * @date 2021.03.04
 **/

"use strict";

// Dependencies
const base58 = require("base-58");

// Primary sub-modules
const Requests = require("./modules/Requests");
const KeyManager = require("./modules/KeyManager");

// Utilities
const Hash = require("./utils/Hash");
const Address = require("./utils/address-utils.js");

// Libraries
const pollTx = require("./lib/polling");

// Constants definitions
const validTxMethods = [
  "createRawArbitTransfer",
  "createRawAssetTransfer",
  "createRawPolyTransfer"
];

/**
 * Each sub-module may be initialized in one of three ways
 * 1. Providing a separetly initialized {@link Requests} and {@link KeyManager} instance. Each of these instances may be initialized using the
 *    static methods `Requests` or `KeyManager` available in the BramblJS class.
 * 2. Providing custom configuration parameters needed to create new instances of each sub-module with the specified parameters
 * 3. Providing minimal inputs (i.e. calling Brambl with only a string constructor arguement). This will create new instances of
 *    the sub-modules with default parameters. KeyManager will create a new keyfile and Requests will target a locally running
 *    instance of Bifrost.
 * @class
 * @classdesc Creates an instance of Brambl for interacting with the Topl protocol
 * @requires Requests
 * @requires KeyManager
 */
class Brambl {
  // private variables
  #networkPrefix;

  /**
    * @constructor
    * @param {object|string} params Constructor parameters object
    * @param {string} params.networkPrefix Network Prefix
    * @param {string} params.password The password used to encrpt the keyfile, same as [params.KeyManager.password]
    * @param {object} params.KeyManager KeyManager object (may be either an instance or config parameters)
    * @param {string} [params.KeyManager.password] The password used to encrpt the keyfile
    * @param {string} [params.KeyManager.keyPath] Path to a keyfile
    * @param {string} [params.KeyManager.constants] Parameters for encrypting the user's keyfile
    * @param {object} params.Requests Request object (may be either an instance or config parameters)
    * @param {string} [params.Requests.url] The chain provider to send requests to
    * @param {string} [params.Requests.apikey] Api key for authorizing access to the chain provider
   */
  constructor(params = {}) {
    // default values for the constructor arguement
    const keyManagerVar = params.KeyManager || {};
    const requestsVar = params.Requests || {};
    this.#networkPrefix = params.networkPrefix || "private";

    // If only a string is given in the constructor, assume it is the password.
    // Therefore, target a local chain provider and make a new key
    if (params.constructor === String) {
      keyManagerVar.password = params;
    }

    if (params.password && params.password.constructor === String) {
      keyManagerVar.password = params.password;
    }

    // validate network prefix
    if (!Address.isValidNetwork(this.#networkPrefix)) {
      throw new Error(`Invalid Network Prefix. Must be one of: ${Address.getValidNetworksList()}`);
    }

    if (requestsVar instanceof Requests) {
      // Request instance provided, reuse it
      this.requests = requestsVar;
    } else {
      // create new instance and pass parameters
      this.requests = new Requests(this.#networkPrefix, requestsVar.url, requestsVar.apiKey);
    }

    // Setup KeyManager object
    if (keyManagerVar instanceof KeyManager) {
      this.keyManager = keyManagerVar;
    } else {
      if (!keyManagerVar.password) throw new Error("An encryption password is required to open a keyfile");
      // create new KeyManager
      this.keyManager = new KeyManager({
        password: keyManagerVar.password,
        keyPath: keyManagerVar.keyPath,
        constants: keyManagerVar.constants,
        networkPrefix: this.#networkPrefix
      });
    }

    // If KeyManager and Requests instances were not created by Brambl class verify that both have a matching NetworkPrefix
    if (this.#networkPrefix !== this.requests.networkPrefix || this.#networkPrefix !== this.keyManager.networkPrefix) {
      throw new Error("Incompatible network prefixes set for Requests and KeyManager Instances.");
    }

    // Expose Utilities
    this.utils = {Hash, Address};
  }

  /**
   * Getter for private property #networkPrefix
   * @memberof Brambl
   * @returns {string} value of #networkPrefix
   */
  get networkPrefix() {
    return this.#networkPrefix;
  }

  /**
   * Setter for private property #isLocked
   * @memberof Brambl
   * @param {any} args ignored, only necessary for setter
   * @returns {void} Error is thrown to protect private variable
   */
  set networkPrefix(args) {
    throw new Error("Invalid private variable access.");
  }

  /**
    * Method for creating a separate Requests instance
    * @static
    *
    * @param {string} [networkPrefix="private"] Network Prefix, defaults to "private"
    * @param {string} [url="http://localhost:9085/"] Chain provider location
    * @param {string} [apiKey="topl_the_world!"] Access key for authorizing requests to the client API
    * @returns {object} new Requests instance
    * @memberof Brambl
    */
  static Requests(networkPrefix, url, apiKey) {
    return new Requests(networkPrefix, url, apiKey);
  }

  /**
    * Method for creating a separate KeyManager instance
    * @static
    *
    * @param {object} params constructor object for key manager or as a string password
    * @param {string} [params.password] password for encrypting (decrypting) the keyfile
    * @param {string} [params.keyPath] path to import keyfile
    * @param {object} [params.constants] default encryption options for storing keyfiles
    * @param {string} [params.networkPrefix] Network Prefix, defaults to "private"
    * @returns {object} new KeyManager instance
    * @memberof Brambl
    */
  static KeyManager(params) {
    return new KeyManager(params);
  }

  /**
   * Method for accessing the hash utility as a static method
   * @static
   *
   * @param {string} type type of hash to construct
   * @param {object | string} msg the msg that will be hashed
   * @param {object | string} encoding optional, default is "base58"
   * @returns {object} Hash Instance
   * @memberof Brambl
   */
  static Hash(type, msg, encoding = "base58") {
    const allowedTypes = ["string", "file", "any"];
    if (!allowedTypes.includes(type)) throw new Error(`Invalid type specified. Must be one of ${allowedTypes}`);
    return Hash[type](msg, encoding);
  }
}

/**
  * Add a signature to a prototype transaction using an unlocked key manager object
  *
  * @param {object} prototypeTx An unsigned transaction JSON object
  * @param {object|object[]} userKeys A keyManager object containing the user's key (may be an array)
  * @returns {object} transaction with signatures to all given key files
 */
Brambl.prototype.addSigToTx = async function(prototypeTx, userKeys) {
  // function for generating a signature in the correct format
  const genSig = (keys, txMsgToSign) => {
    return Object.fromEntries( keys.map( (key) => [key.pk, base58.encode(key.sign(txMsgToSign))]));
  };

  // list of Key Managers
  const keys = Array.isArray(userKeys) ? userKeys : [userKeys];

  return {
    ...prototypeTx.rawTx,
    signatures: genSig(keys, prototypeTx.messageToSign)
  };
};

/**
  * Used to sign a prototype transaction and broadcast to a chain provider
  *
  * @param {object} prototypeTx An unsigned transaction JSON object
  * @returns {promise} requests.broadcastTx promise
  */
Brambl.prototype.signAndBroadcast = async function(prototypeTx) {
  const formattedTx = await this.addSigToTx(prototypeTx, this.keyManager);
  return this.requests.broadcastTx({tx: formattedTx}).catch((e) => {
    console.error(e); throw e;
  });
};

/**
  * Create a new transaction, then sign and broadcast
  *
  * @param {string} method The chain resource method to create a transaction for
  * @param {object} params Transaction parameters object
  * @returns {promise} signAndBroadcast promise
 */
Brambl.prototype.transaction = async function(method, params) {
  if (!validTxMethods.includes(method)) throw new Error("Invalid transaction method");
  return this.requests[method](params)
      .then((res) => this.signAndBroadcast(res.result));
};

/**
  * A function to initiate polling of the chain provider for a specified transaction.
  * This function begins by querying 'getTransactionById' which looks for confirmed transactions only.
  * If the transaction is not confirmed, the mempool is checked using 'getTransactionFromMemPool' to
  * ensure that the transaction is pending. The parameter 'numFailedQueries' specifies the number of consecutive
  * failures (when resorting to querying the mempool) before ending the polling operation prematurely.
  *
  * @param {string} txId The unique transaction ID to look for
  * @param {object} [options] Optional parameters to control the polling behavior
  * @param {number} [options.timeout] The timeout (in seconds) before the polling operation is stopped
  * @param {number} [options.interval] The interval (in seconds) between attempts
  * @param {number} [options.maxFailedQueries] The maximum number of consecutive failures (to find the unconfirmed transaction) before ending the poll execution
  * @returns {promise} pollTx - polling promise
 */
Brambl.prototype.pollTx = async function(txId, options) {
  const opts = options || {timeout: 90, interval: 3, maxFailedQueries: 10};
  return pollTx(this.requests, txId, opts);
};

/**
 * A function to create an Asset Code by utilizing the Key created or imported by
 * Brambl. Asset Codes are necessary to create Raw Asset transactions.
 *
 * @param {string} shortName name of assets, up to 8 bytes long latin-1 enconding
 * @returns {string} asset code is returned if successful
 */
Brambl.prototype.createAssetCode = function(shortName) {
  return this.utils.Address.createAssetCode(this.networkPrefix, this.keyManager.address, shortName);
};

module.exports = Brambl;
