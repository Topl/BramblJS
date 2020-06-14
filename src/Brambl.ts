/**
 * @author James Aman (j.aman@topl.me)
 * @version 3.0.0
 * @date 2020.4.03
 **/

// Dependencies
import base58 from 'base-58';

// Primary sub-modules
import Requests from './modules/Requests';
import KeyManager from './modules/KeyManager';

// Utilities
import Hash from './utils/Hash';

// Libraries
import pollTx from './lib/polling';
import { Params, PrototypeTx, Options, Key } from '../types/brambleTypes';
import { ConstructorParams } from '../types/KeyManagerTypes';

// Constants definitions
const validTxMethods = ['createAssetsPrototype', 'transferAssetsPrototype', 'transferTargetAssetsPrototype'];

/**
 * @class Creates an instance of Brambl for interacting with the Topl protocol
 * @requires KeyManager
 * @requires Requests
 *
 * Each sub-module may be initialized in one of three ways
 * 1. Providing a separetly initialized Request and KeyManager instance. Each of these instances may be initialized using the
 *    static methods `Requests` or `KeyManager` available in the BramblJS class.
 * 2. Providing custom configuration parameters needed to create new instances of each sub-module with the specified parameters
 * 3. Providing minimal inputs (i.e. calling Brambl with only a string constructor arguement). This will create new instances of
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

const emptyKeyMan: any = {};
class Brambl {
    requests: any;
    keyManager: KeyManager;
    keyMan: any;
    utils: Hash;
    addSigToTx: (prototypeTx: PrototypeTx, userKeys: KeyManager) => any;
    signAndBroadcast: (prototypeTx: PrototypeTx) => any;
    transaction: (method: string, params: any) => any;
    pollTx: (txId: string, options: Options) => any;
    constructor(params: Params) {
        this.keyMan = KeyManager;
        // default values for the constructor arguement
        const keyManagerVar = params.KeyManager || emptyKeyMan;
        const requestsVar = params.Requests || emptyKeyMan;
        // if only a string is given in the constructor, assume it is the password.
        // Therefore, target a local chain provider and make a new key
        if (params.constructor === String) keyManagerVar.password = params;
        // Setup reqeusts object
        if (requestsVar.instance) {
            this.requests = requestsVar.instance;
        } else if (requestsVar.url) {
            this.requests = new Requests(requestsVar.url, requestsVar.apiKey);
        } else {
            this.requests = new Requests();
        }

        // Setup KeyManager object
        if (!keyManagerVar.password) throw new Error('An encryption password is required to open a keyfile');
        if (keyManagerVar.instance) {
            this.keyManager = keyManagerVar.instance;
        } else if (keyManagerVar.keyPath) {
            this.keyManager = new KeyManager({
                password: keyManagerVar.password,
                keyPath: keyManagerVar.keyPath,
                constants: keyManagerVar.constants,
            });
        } else {
            this.keyManager = new KeyManager(keyManagerVar.password);
        }

        // Import utilities
        this.utils = { Hash };
    }

    /**
     * Method for creating a separate Requests instance
     * @static
     *
     * @param {string} [url="http://localhost:9085/"] Chain provider location
     * @param {string} [apiKey="topl_the_world!"] Access key for authorizing requests to the client API
     * @memberof Brambl
     */
    static Requests(url: string, apiKey: string) {
        return new Requests(url, apiKey);
    }

    /**
     * Method for creating a separate KeyManager instance
     * @static
     *
     * @param {object} params constructor object for key manager
     * @param {string} params.password password for encrypting (decrypting) the keyfile
     * @param {string} [params.path] path to import keyfile
     * @param {object} [params.constants] default encryption options for storing keyfiles
     * @memberof Brambl
     */
    static KeyManager(params: ConstructorParams) {
        return new KeyManager(params);
    }
}
/**  
 * Add a signature to a prototype transaction using the an unlocked key manager object
 * 
 * @param {object} prototypeTx An unsigned transaction JSON object
 * @param {object|object[]} userKeys A keyManager object containing the user's key (may be an array)


/**
 * Used to sign a prototype transaction and broadcast to a chain provider
 *
 * @param {object} prototypeTx An unsigned transaction JSON object
 */

Brambl.prototype.addSigToTx = async function (prototypeTx: PrototypeTx, userKeys: KeyManager) {
    // function for generating a signature in the correct format
    const genSig = (keys: Array<any>, txBytes: any) => {
        return Object.fromEntries(keys.map((key: Key) => [key.pk, base58.encode(key.sign(txBytes))]));
    };

    // in case a single given is given not as an array
    const keys = Array.isArray(userKeys) ? userKeys : [userKeys];

    // add signatures of all given key files to the formatted transaction
    return {
        ...prototypeTx.formattedTx,
        signatures: genSig(keys, base58.decode(prototypeTx.messageToSign)),
    };
};
Brambl.prototype.signAndBroadcast = async function (prototypeTx: PrototypeTx) {
    const formattedTx = await this.addSigToTx(prototypeTx, this.keyManager);

    return this.requests.broadcastTx({ tx: formattedTx }).catch((e: string) => {
        console.error(e);
        throw e;
    });
};

/**
 * Create a new transaction, then sign and broadcast
 *
 * @param {string} method The chain resource method to create a transaction for
 */
Brambl.prototype.transaction = async function (method: string, params: any) {
    if (!validTxMethods.includes(method)) throw new Error('Invalid transaction method');

    return this.requests[method](params).then((res: { result: any }) => this.signAndBroadcast(res.result));
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
 */
Brambl.prototype.pollTx = async function (txId: string, options: Options) {
    const opts = options || { timeout: 90, interval: 3, maxFailedQueries: 10 };
    return pollTx(this.requests, txId, opts);
};
export = Brambl;
