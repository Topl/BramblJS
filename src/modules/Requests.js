/** A Javascript API wrapper module for the Bifrost Protocol.
 * Currently supports version 4.1 of Bifrost's Brambl-Layer API
 * Documentation for Brambl-layer is available at https://Requests.docs.topl.co
 *
 * @author James Aman (j.aman@topl.me)
 * @date 2020.0.29
 *
 * Based on the original work of Yamir Tainwala - 2019
 */

//TODO: 
// DONE add network prefix here... as optional, specially when coming from Brambl
// DONE network prefix should map url to be used... as defaults
// DONE users have the option to include different urls
// add util script to check for prefix in all addresses.
// check addresses on all operations which have recipients, sender, changeaddress and consolidaitonadddress



"use strict";

// Dependencies
const fetch = require("node-fetch");
const utils = require("../utils/address-utils.js");

/**
 * General builder function for formatting API request
 *
 * @param {object} routeInfo - call specific information
 * @param {string} routeInfo.route - the route where the request will be sent
 * @param {string} routeInfo.method - the json-rpc method that will be triggered on the node
 * @param {string} routeInfo.id - an identifier for tracking requests sent to the node
 * @param {object} params - method specific parameter object
 * @param {object} self - internal reference for accessing constructor data
 * @returns {object} JSON response from the node
 */
async function bramblRequest(routeInfo, params, self) {
  try {
    const route = routeInfo.route;
    const body = {
      jsonrpc: "2.0",
      id: routeInfo.id || "1",
      method: routeInfo.method,
      params: [
        {...params}
      ]
    };
    const payload = {
      url: self.url + route,
      method: "POST",
      headers: self.headers,
      body: JSON.stringify(body)
    };
    //console.log(payload)
    const response = await (await fetch(self.url + route, payload)).json();
    if (response.error) {
      throw response;
    } else {
      return response;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * @class Requests
 * @classdesc A class for sending requests to the Brambl layer interface of the given chain provider
 */
class Requests {
  /**
   * @constructor
   * @param {string} [networkPrefix="local"] Network Prefix, defaults to "local"
   * @param {string} [url="http://localhost:9085/"] Chain provider location, local and private default to http://localhost:9085/
   * @param {string} [apiKey="topl_the_world!"] Access key for authorizing requests to the client API ["x-api-key"], default to "topl_the_world!"
   */
  constructor(networkPrefix, url, apiKey) {
    // set networkPrefix and validate
    this.networkPrefix = networkPrefix || "local";

    if(this.networkPrefix !== "local" && !utils.isValidNetwork(this.networkPrefix)){
      throw new Error(`Invalid Network Prefix. Must be one of: ${utils.getValidNetworksList()}`);
    }

    // set url or get default values from utils
    this.url = url || utils.getUrlByNetwork(this.networkPrefix);

    // set apiKey or set default
    this.apiKey = apiKey || "topl_the_world!";

    this.headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey
    };
  }

  /**
   * Allows setting a different url than the default from which to create and accept RPC connections
   * @param {string} url url string for instance
   * @returns {void}
   */
  setUrl(url) {
    this.url = url;
  }

  /**
   * Allows setting a different x-api-key than the default
   * @param {string} apiKey api-key for "x-api-key"
   * @returns {void}
   */
  setApiKey(apiKey) {
    this.headers["x-api-key"] = apiKey;
  }
  /* -------------------------------------------------------------------------- */
  /*                             Topl Api Routes                                */
  /* -------------------------------------------------------------------------- */

  /* ---------------------- Create Raw Asset Trasfer ------------------------ */
  /**
   * Create a new asset on chain
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.propositionType - Proposition Type -> PublicKeyCurve25519 || TheresholdCurve25519
   * @param {string} params.recipients - 2-dimensional array (array of tuples) -> [["publicKey of asset recipient", quantity]]
   * @param {string} params.assetCode - Identifier of the asset
   * @param {string} params.sender - Public key of the asset issuer
   * @param {string} params.changeAddress - Public key of the change recipient
   * @param {boolean} params.minting - Minting boolean
   * @param {number} params.fee - Fee to apply to the transaction
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async createRawAssetTransfer(params, id = "1") {
    const validPropositions = ["PublicKeyCurve25519", "TheresholdCurve25519"];

    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.propositionType || !validPropositions.includes(params.propositionType)) {
      throw new Error("A propositionTYpe must be specified: <PublicKeyCurve25519, TheresholdCurve25519>");
    }
    if (!params.sender) {
      throw new Error("An asset issuer must be specified");
    }
    if (!params.assetCode) {
      throw new Error("An assetCode must be specified");
    }
    if (!params.recipients || params.recipients.length < 1) {
      throw new Error("At least one recipient must be specified");
    }
    if (!params.changeAddress) {
      throw new Error("A changeAddress must be specified");
    }
    if (typeof params.minting !== "boolean") {
      throw new Error("Minting boolean value must be specified");
    }
    // 0 fee value is accepted
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    // fee must be >= 0
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }

    // validate all addresses
    let validationResult = utils.validateAddressesByNetwork(this.networkPrefix, params);
    if(!validationResult.success){
      throw new Error("Invalid Addresses::"
        + " Network Type: <" + this.networkPrefix + ">"
        + " Addresses: <" + validationResult.invalidAddresses + ">");
    }
    //[[addres, quantity], [addres, quantity], [addres, quantity], [addres, quantity]]

    //[[addres, quantity, securityRoot, metadata], [addres, quantity], [addres, quantity], [addres, quantity]]
    // transform recipients ["address", quantity] to correct tuples
    for (let i = 0; i < params.recipients.length; i++) {
      // destructuring assingment syntax
      let [address, quantity] = params.recipients[i];

      // ensure quantitiy is part of the tuple ["address", 10]
      if (!quantity) {
        throw new Error("Recipient quantity must be specified");
      }
      params.recipients[i] = [
        address,
        {
          "type": "Asset",
          "quantity": quantity,
          "assetCode": params.assetCode
        }
      ];
    }

    const route = "";
    const method = "topl_rawAssetTransfer";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ---------------------- Create Raw Poly Trasfer ------------------------ */
  /**
   * Create a new poly on chain
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.propositionType - Proposition Type -> PublicKeyCurve25519 || TheresholdCurve25519
   * @param {string} params.recipients - 2-dimensional array (array of tuples) -> [["publicKey of asset recipient", quantity]]
   * @param {array} params.sender - List of senders addresses
   * @param {string} params.changeAddress - Address of the change recipient
   * @param {number} params.fee - Fee to apply to the transaction
   * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async createRawPolyTransfer(params, id = "1") {
    const validPropositions = ["PublicKeyCurve25519", "TheresholdCurve25519"];

    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.propositionType || !validPropositions.includes(params.propositionType)) {
      throw new Error("A propositionTYpe must be specified: <PublicKeyCurve25519, TheresholdCurve25519>");
    }
    if (!params.sender) {
      throw new Error("An asset issuer must be specified");
    }
    if (!params.recipients || params.recipients.length < 1) {
      throw new Error("At least one recipient must be specified");
    }
    if (!params.changeAddress) {
      throw new Error("A changeAddress must be specified");
    }
    // 0 fee value is accepted
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    // fee must be >= 0
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }

    // validate all addresses
    let validationResult = utils.validateAddressesByNetwork(this.networkPrefix, params);
    if(!validationResult.success){
      throw new Error("Invalid Addresses::"
        + " Network Type: <" + this.networkPrefix + ">"
        + " Addresses: <" + validationResult.invalidAddresses + ">");
    }

    params.recipients.forEach(recipient => {
      // ensure quantitiy is part of the tuple ["address", 10]
      if (!recipient[1]) {
        throw new Error("Recipient quantity must be specified");
      }
    });

    const route = "";
    const method = "topl_rawPolyTransfer";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ---------------------- Create Raw Arbit Trasfer ------------------------ */
  /**
   * Create a new arbit on chain
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.propositionType - Proposition Type -> PublicKeyCurve25519 || TheresholdCurve25519
   * @param {string} params.recipients - 2-dimensional array (array of tuples) -> [["publicKey of asset recipient", quantity]]
   * @param {array} params.sender - List of senders addresses
   * @param {string} params.changeAddress - Address of the change recipient
   * @param {string} params.consolidationAddress - Address of the change recipient
   * @param {number} params.fee - Fee to apply to the transaction
   * @param {string} [params.data] - Data string which can be associated with this transaction (may be empty)
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async createRawArbitTransfer(params, id = "1") {
    const validPropositions = ["PublicKeyCurve25519", "TheresholdCurve25519"];

    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.propositionType || !validPropositions.includes(params.propositionType)) {
      throw new Error("A propositionTYpe must be specified: <PublicKeyCurve25519, TheresholdCurve25519>");
    }
    if (!params.sender) {
      throw new Error("An asset issuer must be specified");
    }
    if (!params.recipients || params.recipients.length < 1) {
      throw new Error("At least one recipient must be specified");
    }
    if (!params.changeAddress) {
      throw new Error("A changeAddress must be specified");
    }
    if (!params.consolidationAddress) {
      throw new Error("A consolidationAddress must be specified");
    }
    // 0 fee value is accepted
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    // fee must be >= 0
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }

    // validate all addresses
    let validationResult = utils.validateAddressesByNetwork(this.networkPrefix, params);
    if(!validationResult.success){
      throw new Error("Invalid Addresses::"
        + " Network Type: <" + this.networkPrefix + ">"
        + " Addresses: <" + validationResult.invalidAddresses + ">");
    }

    params.recipients.forEach(recipient => {
      // ensure quantitiy is part of the tuple ["address", 10]
      if (!recipient[1]) {
        throw new Error("Recipient quantity must be specified");
      }
    });

    const route = "";
    const method = "topl_rawArbitTransfer";
    return bramblRequest({route, method, id}, params, this);
  }

  /* --------------------------------- broadcastTx --------------------------------------- */
  /**
   * Have the node sign a `messageToSign` raw transaction
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.tx - a JSON formatted transaction (must include signature(s))
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async broadcastTx(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.tx) {
      throw new Error("A tx object must be specified");
    }
    if (!params.tx.signatures || !Object.keys(params.tx.signatures)[0]) {
      throw new Error("Tx must include signatures");
    }
    if (Object.keys(params.tx).length < 10 && params.tx.constructor === Object) {
      throw new Error("Invalid tx object, one or more tx keys not specified");
    }
    const route = "";
    const method = "topl_broadcastTx";
    return bramblRequest({route, method, id}, params, this);
  }

  /**
   * Return the chain information
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getLatestBlock(id = "1") {
    const params = {};
    const route = "";
    const method = "topl_head";
    return bramblRequest({route, method, id}, params, this);
  }


  /**
   * Get the balances of a specified public key in the keyfiles directory of the node
   * @param {Object} params - body parameters passed to the specified json-rpc method
   * @param {string[]} params.addresses - An array of addresses to query the balance for
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async lookupBalancesByKey(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.addresses || !Array.isArray(params.addresses)) {
      throw new Error("A list of publicKeys must be specified");
    }
    const route = "";
    const method = "topl_balances";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ----------------------------- getMempool ------------------------------------ */
  /**
   * Return the entire mempool of the node
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getMempool(id = "1") {
    const params = {};
    const route = "";
    const method = "topl_mempool";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------------- getTransactionById ---------------------------- */
  /**
   * Lookup a transaction from history by the provided id
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.transactionId - Unique identifier of the transaction to retrieve
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getTransactionById(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.transactionId) {
      throw new Error("A transactionId must be specified");
    }
    const route = "";
    const method = "topl_transactionById";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------------- getTransactionFromMempool ---------------------------- */
  /**
   * Lookup a transaction from the mempool by the provided id
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.transactionId - Unique identifier of the transaction to retrieve
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getTransactionFromMempool(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.transactionId) {
      throw new Error("A transactionId must be specified");
    }
    const route = "";
    const method = "topl_transactionFromMempool";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ----------------------------- getBlockById --------------------------------- */
  /**
   * Lookup a block from history by the provided id
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.blockId - Unique identifier of the block to retrieve
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getBlockById(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.blockId) {
      throw new Error("A blockId must be specified");
    }
    const route = "";
    const method = "topl_blockById";
    return bramblRequest({route, method, id}, params, this);
  }


  /* ----------------------------- getBlockByHeight --------------------------------- */
  /**
   * Lookup a block from history by the provided id
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {number} params.height - Height as an integer number
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getBlockByHeight(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.height) {
      throw new Error("A height must be specified");
    }

    // ensure it is an integer
    params.height = parseInt(params.height, 10);
    if (params.height > 0) {
      throw new Error("Height must be a number >= 0");
    }

    const route = "";
    const method = "topl_blockById";
    return bramblRequest({route, method, id}, params, this);
  }


  /* ------------------------------------------------------------------------------------------------------------------------------------------ */





  /* ------------------------------ generateKeyfile ------------------------------------- */
  /**
   * Generate a new keyfile in the node keyfile directory
   * @param {Object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.password - Password for encrypting the new keyfile
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async generateKeyfile(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.password) {
      throw new Error("A password must be provided to encrypt the keyfile");
    }
    const route = "wallet/";
    const method = "generateKeyfile";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------------------- unlockKeyfile ------------------------------------- */
  /**
   * Unlock a keyfile in the node's keyfile directory
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.publicKey - Base58 encoded public key to get the balance of
   * @param {string} params.password - Password used to encrypt the keyfile
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async unlockKeyfile(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.publicKey) {
      throw new Error("A publicKey field must be specified");
    }
    if (!params.password) {
      throw new Error("A password must be provided to encrypt the keyfile");
    }
    const route = "wallet/";
    const method = "unlockKeyfile";
    return bramblRequest({route, method, id}, params, this);
  }

  /* --------------------------------- lockKeyfile -------------------------------------- */
  /**
   * Lock an open keyfile
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.publicKey - Base58 encoded public key to get the balance of
   * @param {string} params.password - Password used to encrypt the keyfile
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async lockKeyfile(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.publicKey) {
      throw new Error("A publicKey field must be specified");
    }
    if (!params.password) {
      throw new Error("A password must be provided to encrypt the keyfile");
    }
    const route = "wallet/";
    const method = "lockKeyfile";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ------------------------------ listOpenKeyfiles ------------------------------------ */
  /**
   * Get a list of all open keyfiles
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async listOpenKeyfiles(id = "1") {
    const params = {};
    const route = "wallet/";
    const method = "listOpenKeyfiles";
    return bramblRequest({route, method, id}, params, this);
  }


  
  /* ------------------------------ signTransaction --------------------------------------- */
  /**
   * Have the node sign a JSON formatted prototype transaction
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.publicKey - Base58 encoded public key to get the balance of
   * @param {string} params.tx - a JSON formatted prototype transaction
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async signTransaction(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.publicKey) {
      throw new Error("A publicKey field must be specified");
    }
    if (!params.tx) {
      throw new Error("A tx object must be specified");
    }
    const route = "wallet/";
    const method = "signTx";
    return bramblRequest({route, method, id}, params, this);
  }

  

  /* ------------------------------ transferPolys --------------------------------------- */
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
  async transferPolys(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.recipient) {
      throw new Error("A recipient must be specified");
    }
    if (!params.amount) {
      throw new Error("An amount must be specified");
    }
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }
    const route = "wallet/";
    const method = "transferPolys";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ------------------------------ transferArbits --------------------------------------- */
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
  async transferArbits(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.recipient) {
      throw new Error("A recipient must be specified");
    }
    if (!params.amount) {
      throw new Error("An amount must be specified");
    }
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }
    const route = "wallet/";
    const method = "transferArbits";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------------------------------------------------------------- */
  /*                           Asset Api Routes                                 */
  /* -------------------------------------------------------------------------- */

  /* ---------------------- createAssetsPrototype ------------------------ */
  /**
   * 
   * TODO: RA - Remove this and replace it in test scripts and unit testing
   * 
   * 
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
  async createAssetsPrototype(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.issuer) {
      throw new Error("An asset issuer must be specified");
    }
    if (!params.assetCode) {
      throw new Error("An assetCode must be specified");
    }
    if (!params.recipient) {
      throw new Error("A recipient must be specified");
    }
    if (!params.amount) {
      throw new Error("An amount must be specified");
    }
    // 0 fee value is accepted
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    // fee must be >= 0
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }

    const route = "/";
    const method = "topl_rawAssetTransfer";
    return bramblRequest({route, method, id}, params, this);
  }


  /* --------------------------- transferAssetsPrototype ------------------------------ */
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
  async transferAssetsPrototype(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.issuer) {
      throw new Error("An asset issuer must be specified");
    }
    if (!params.assetCode) {
      throw new Error("An assetCode must be specified");
    }
    if (!params.recipient) {
      throw new Error("A recipient must be specified");
    }
    if (!params.sender) {
      throw new Error("A sender must be specified");
    }
    if (!params.amount) {
      throw new Error("An amount must be specified");
    }
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }
    const route = "asset/";
    const method = "transferAssetsPrototype";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------------- transferTargetAssetsPrototype ----------------------------- */
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
  async transferTargetAssetsPrototype(params, id = "1") {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.recipient) {
      throw new Error("A recipient must be specified");
    }
    if (!params.sender) {
      throw new Error("A sender must be specified");
    }
    if (!params.assetId) {
      throw new Error("An assetId is required for this request");
    }
    if (!params.amount) {
      throw new Error("An amount must be specified");
    }
    if (!params.fee && params.fee !== 0) {
      throw new Error("A fee must be specified");
    }
    if (params.fee < 0) {
      throw new Error("Invalid fee, a fee must be greater or equal to zero");
    }
    const route = "asset/";
    const method = "transferTargetAssetsPrototype";
    return bramblRequest({route, method, id}, params, this);
  }


  /* -------------------------------------------------------------------------- */
  /*                            Debug Api Routes                                */
  /* -------------------------------------------------------------------------- */

  /* ------------------------- Get chain information -------------------------- */
  /**
   * Return the chain information
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async chainInfo(id = "1") {
    const params = {};
    const route = "debug/";
    const method = "info";
    return bramblRequest({route, method, id}, params, this);
  }

  /* ------------------------- Calculate block delay --------------------------- */
  /**
   * Get the average delay between blocks
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @param {object} params - body parameters passed to the specified json-rpc method
   * @param {string} params.blockId - Unique identifier of a block
   * @param {string} params.numBlocks - Number of blocks to consider behind the specified block
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async calcDelay(id = "1", params) {
    if (!params) {
      throw new Error("A parameter object must be specified");
    }
    if (!params.blockId) {
      throw new Error("A blockId must be specified");
    }
    if (!params.numBlocks) {
      throw new Error("A number of blocks must be specified");
    }
    const route = "debug/";
    const method = "delay";
    return bramblRequest({route, method, id}, params, this);
  }

  /* -------------------- Blocks generated by node's keys ------------------------- */
  /**
   * Return the number of blocks forged by keys held by this node
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async myBlocks(id = "1") {
    const params = {};
    const route = "debug/";
    const method = "myBlocks";
    return bramblRequest({route, method, id}, params, this);
  }

  async testAddressCheck(id = "1") {
    let params = {
      "address": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "network": "local"
    };
    const route = "";
    const method = "util_checkValidAddress";
    return bramblRequest({route, method, id}, {
      "address": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "network": "local"
    }, this);
  }

  /* --------------------- Map block geneators to blocks --------------------------- */
  /**
   * Return the blockIds that each accessible key has forged
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async blockGenerators(id = "1") {
    const params = {};
    const route = "debug/";
    const method = "generators";
    return bramblRequest({route, method, id}, params, this);
  }


}




/* -------------------------------------------------------------------------- */

module.exports = Requests;

/* -------------------------------------------------------------------------- */
