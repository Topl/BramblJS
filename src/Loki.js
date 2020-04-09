/** 
 * @author James Aman (j.aman@topl.me)
 * @version 3.0.0
 * @date 2020.4.03
 **/

 // Dependencies
 const base58 = require('base-58')

 // Primary sub-modules
 const Requests = require('./modules/Requests');
 const KeyManager = require('./modules/KeyManager');

 // Utilities
 const Hash = require('./utils/Hash')
 
 // Libraries
 const pollTx = require('./lib/polling')
 
 // Constants definitions
 const validTxMethods = [
     'createAssetsPrototype',
     'transferAssetsPrototype',
     'transferTargetAssetsPrototype'
 ]
 
 /**
  * @class Creates an instance of Loki for interacting with the Topl protocol
  * @requires KeyManager
  * @requires Requests
  * 
  * Each sub-module may be initialized in one of three ways
  * 1. Providing a separetly initialized Request and KeyManager instance. Each of these instances may be initialized using the 
  *    static methods `Requests` or `KeyManager` available in the LokiJS class.
  * 2. Providing custom configuration parameters needed to create new instances of each sub-module with the specified parameters
  * 3. Providing minimal inputs (i.e. calling Loki with only a string constructor arguement). This will create new instances of
  *    the sub-modules with default parameters. KeyManager will create a new keyfile and Requests will target a locally running
  *    instance of Bifrost. 
  * @param {object|string} [params={}]
  * @param {object} params.KeyManager KeyManager object (may be either an instance or config parameters)
  * @param {string} params.KeyManager.password The password used to encrpt the keyfile
  * @param {object} [params.KeyManager.instance] A previously initialized instance of KeyManager
  * @param {string} [params.KeyManager.keyPath] Path to a keyfile
  * @param {string} [params.KeyManager.constants] Parameters for encrypting the user's keyfile
  * @param {object} params.Requests Request object (may be either an instance or config parameters)
  * @param {string} [params.Requests.url] The chain provider to send requests to
  * @param {string} [params.Requests.apikey] Api key for authorizing access to the chain provider
  */
 class Loki {
     constructor(params = {}) {
         // default values for the constructor arguement
         const keyManagerVar = params.KeyManager || {};
         const requestsVar = params.Requests || {};
 
         // if only a string is given in the constructor, assume it is the password.
         // Therefore, target a local chain provider and make a new key
         if (params.constructor === String) keyManagerVar.password = params
 
 
         // Setup reqeusts object
         if (requestsVar.instance) {
             this.requests = requestsVar.instance
         } else if (requestsVar.url) { 
             this.requests = new Requests(requestsVar.url, requestsVar.apiKey)
         } else {
             this.requests = new Requests()
         }
 
         // Setup KeyManager object
         if (!keyManagerVar.password) throw new Error('An encryption password is required to open a keyfile')
         if (keyManagerVar.instance) {
             this.keyManager = keyManagerVar.instance
         } else if(keyManagerVar.keyPath) {
             this.keyManager = new KeyManager({ password: keyManagerVar.password, keyPath: keyManagerVar.keyPath, constants: keyManagerVar.constants })
         } else {
             this.keyManager = new KeyManager({ password: keyManagerVar.password })
         }
         
         // Import utilities
         this.utils = { Hash }
     }
 
     /**
      * Method for creating a separate Requests instance
      * @static
      * 
      * @param {string} [url="http://localhost:9085/"] Chain provider location
      * @param {string} [apiKey="topl_the_world!"] Access key for authorizing requests to the client API
      * @memberof Loki
      */
     static Requests(url, apiKey) {
         return new Requests(url, apiKey)
     }
 
     /**
      * Method for creating a separate KeyManager instance
      * @static
      * 
      * @param {object} params constructor object for key manager
      * @param {string} params.password password for encrypting (decrypting) the keyfile
      * @param {string} [params.path] path to import keyfile
      * @param {object} [params.constants] default encryption options for storing keyfiles
      * @memberof Loki
      */
     static KeyManager(params) {
         return new KeyManager(params)
     }
 }
 
 /**  
  * Add a signature to a prototype transaction using the an unlocked key manager object
  * 
  * @param {object} prototypeTx An unsigned transaction JSON object
  * @param {object|object[]} userKeys A keyManager object containing the user's key (may be an array)
 */
 Loki.prototype.addSigToTx = async function (prototypeTx, userKeys) {
     // function for generating a signature in the correct format
     const genSig = (keys, txBytes) => {
         return Object.fromEntries( keys.map( key => [key.pk, base58.encode(key.sign(txBytes))]));
     }
 
     // in case a single given is given not as an array
     const keys = Array.isArray(userKeys) ? userKeys : [userKeys]
 
     // add signatures of all given key files to the formatted transaction
     return { 
         ...prototypeTx.formattedTx, 
         signatures: genSig(keys, base58.decode(prototypeTx.messageToSign))
     }
 }
 
 /**
  * Used to sign a prototype transaction and broadcast to a chain provider
  *
  * @param {object} prototypeTx An unsigned transaction JSON object
  */
 Loki.prototype.signAndBroadcast = async function (prototypeTx) {
     const formattedTx = await this.addSigToTx(prototypeTx, this.keyManager)
     return this.requests.broadcastTx({ tx: formattedTx }).catch(e => { console.error(e); throw e })
 }
 
 /** 
  * Create a new transaction, then sign and broadcast
  * 
  * @param {string} method The chain resource method to create a transaction for
 */
 Loki.prototype.transaction = async function (method, params) {
     if (!validTxMethods.includes(method)) throw new Error('Invalid transaction method')
     return this.requests[method](params).then(res => this.signAndBroadcast(res.result))
 }
 
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
  * @param {number} [options.numFailedQueries] The maximum number of consecutive failures (to find the unconfirmed transaction) before ending the poll execution
 */
 Loki.prototype.pollTx = async function(txId, options) {
     const opts = options || { timeout: 60, interval: 3, numFailedQueries: 5 }
     return pollTx(this.requests, txId, opts)
 }
 
 module.exports = Loki
 