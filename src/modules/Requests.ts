/** A Javascript API wrapper module for the Bifrost Protocol.
 * Currently supports version 4.1 of Bifrost's Brambl-Layer API
 * Documentation for Brambl-layer is available at https://Requests.docs.topl.co
 *
 * @author James Ama (j.aman@topl.me)
 * @date 2020.0.29
 * 
 * Based on the original work of Yamir Tainwala - 2019
 */

("use strict");

// Dependencies
import fetch from 'node-fetch'
import {RoutInfo, Self, Params, BalancesParams, TxParams, TransferParams, TransferArbitParams, TransferAssetsParams, TransferTargetAssetsParams, TransferTargetAssetsPrototypeParams, getTransactionById, GetBlockById, CalcDelay} from "../types/RequestsTypes"
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

async function BramblRequest(routeInfo:RoutInfo, params:Object, self:Self) {
  try {
    const route = routeInfo.route;
    const body = {
      jsonrpc: "2.0",
      id: routeInfo.id || "1",
      method: routeInfo.method,
      params: [
        { ...params }
      ]
    };
    const payload = {
      url: self.url + route,
      method: "POST",
      headers: self.headers,
      body: JSON.stringify(body)
    };
    const response = await (await fetch(self.url + route, payload)).json();
    if (response.error) { throw response }
    else { return response }

  } catch (err) {
    throw err
  }
};
/**
 * A function to ensure the parameters object is not empty and has the correct keys.
 * @param {any} params parameter object
 * @param {Array} keysList List of Keys nessesary for the parameter object to include.
 * @class Requests
 */
function checkParams(params:any, keysList:Array<any>) {
  let desParams = Object.entries(params)
  let structuredArr:Array<any> = []
  desParams.forEach(function(keyPair){
      if(keyPair[1]===undefined||keyPair===null){
          throw new Error("A "+keyPair[0]+" key must be specified cant use undefined or null");
      }
      structuredArr.push(keyPair[0])
  })
  if(!params){
       throw new Error("A parameter object must be specified");

  }else{
      
      if(JSON.stringify(keysList.sort()) !== JSON.stringify(structuredArr.sort())){
          var key = ""
          keysList.forEach(function(keys){
              key += keys+", "
          })
          console.log(key)
          throw new Error("Make Sure you filling only the correct keys, keys you must fill are "+ key);
      }else{
          
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
  url:string;
  headers:any;
  constructor(url = "http://localhost:9085/", apiKey = "topl_the_world!") {
    this.url = url;
    this.headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    };
  }
  //Allows setting a different url than the default from which to create and accept RPC connections
  setUrl(url:string) {
    this.url = url;
  }
  setApiKey(apiKey:string) {
    this.headers["x-api-key"] = apiKey;
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
  async getBalancesByKey(params:BalancesParams, id = "1") {
    checkParams(params, ["publicKeys"])
    const route = "wallet/";
    const method = "balances";
    
    return BramblRequest({ route, method, id }, params, this);
  }
  //////listOpenKeyfiles////////////////
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
    return BramblRequest({ route, method, id }, params, this);
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
  async generateKeyfile(params:Params, id = "1") {
    checkParams(params, ["password"])

    const route = "wallet/";
    const method = "generateKeyfile";
    return BramblRequest({ route, method, id }, params, this);
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
  async lockKeyfile(params:Params, id = "1") {
    checkParams(params, ["publicKey", "password"])

    const route = "wallet/";
    const method = "lockKeyfile";
    return BramblRequest({ route, method, id }, params, this);
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
  async unlockKeyfile(params:Params, id = "1") {
    checkParams(params, ["publicKey", "password"])

    const route = "wallet/";
    const method = "unlockKeyfile";
    return BramblRequest({ route, method, id }, params, this);
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
  async signTransaction(params:TxParams, id = "1") {
    checkParams(params, ["publicKey", "tx"])

    const route = "wallet/";
    const method = "signTx";
    return BramblRequest({ route, method, id }, params, this);
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
  async broadcastTx(params:{tx:string}, id = "1") {
    checkParams(params, ["tx"])

    const route = "wallet/";
    const method = "broadcastTx";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferPolys(params:TransferArbitParams, id = "1") {

    checkParams(params, ["amount", "recipient", "fee"])
    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "wallet/";
    const method = "transferPolys";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferArbits(params:TransferArbitParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "wallet/";
    const method = "transferArbits";
    return BramblRequest({ route, method, id }, params, this);
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
  async createAssets(params:TransferParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetCode", "issuer"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be > 0");
    const route = "asset/";
    const method = "createAssets";
    return BramblRequest({ route, method, id }, params, this);
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
  async createAssetsPrototype(params:TransferParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetCode", "issuer"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be > 0");
    const route = "asset/";
    const method = "createAssetsPrototype";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferAssets(params:TransferParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetCode", "issuer"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "asset/";
    const method = "transferAssets";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferAssetsPrototype(params:TransferAssetsParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetCode", "issuer"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "asset/";
    const method = "transferAssetsPrototype";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferTargetAssets(params:TransferTargetAssetsParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetId"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "asset/";
    const method = "transferTargetAssets";
    return BramblRequest({ route, method, id }, params, this);
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
  async transferTargetAssetsPrototype(params:TransferTargetAssetsPrototypeParams, id = "1") {
    checkParams(params, ["amount", "recipient", "fee", "assetId", "sender"])

    if (!params.fee && params.fee !== 0)
      throw new Error("A fee must be specified");
    const route = "asset/";
    const method = "transferTargetAssetsPrototype";
    return BramblRequest({ route, method, id }, params, this);
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
  async getTransactionById(params:getTransactionById, id = "1") {
    checkParams(params, ["transactionId"])

    const route = "nodeView/";
    const method = "transactionById";
    return BramblRequest({ route, method, id }, params, this);
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
  async getTransactionFromMempool(params:getTransactionById, id = "1") {
    checkParams(params, ["transactionId"])

    const route = "nodeView/";
    const method = "transactionFromMempool";
    return BramblRequest({ route, method, id }, params, this);
  }
  /////////////////getMempool////////////
  /**
   * Return the entire mempool of the node
   * @param {string} [id="1"] - identifying number for the json-rpc request
   * @returns {object} json-rpc response from the chain
   * @memberof Requests
   */
  async getMempool(id = "1") {
    const params = {};
    const route = "nodeView/";
    const method = "mempool";
    return BramblRequest({ route, method, id }, params, this);
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
  async getBlockById(params:GetBlockById, id = "1") {
    checkParams(params, ["blockId"])

    const route = "nodeView/";
    const method = "blockById";
    return BramblRequest({ route, method, id }, params, this);
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

  async chainInfo(id = "1") {
    var params = {};
    const route = "debug/";
    const method = "info";

    
    return BramblRequest({ route, method, id }, params, this);
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
  async calcDelay(params:CalcDelay, id = "1") {
    checkParams(params, ["blockId", "numBlocks"])

    const route = "debug/";
    const method = "delay";
    return BramblRequest({ route, method, id }, params, this);
  }
  //////////Blocks generated by node's keys////////////
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
    return BramblRequest({ route, method, id }, params, this);
  }
  /////////Map block geneators to blocks////////////
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
    return BramblRequest({ route, method, id }, params, this);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export = Requests;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
