/**
 * @fileOverview Utility encryption related functions for KeyManager module.
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 *
 * @exports KeyUtils create, dump, recover, str2buf, generateKeystoreFilename
 */

"use strict";

// Dependencies
const blake = require("blake2");
const crypto = require("crypto");
const Base58 = require("base-58");
const keccakHash = require("keccak");
const curve25519 = require("curve25519-js");

const validNetworks = ['local', 'private', 'toplnet', 'valhalla', 'hel'];

const networksDefaults = {
  'local': {
    hex: "0x30",
    decimal: 48,
    url: "http://localhost:9085/"
  },
  'private': {
    hex: "0x40",
    decimal: 64,
    url: "http://localhost:9085/"
  },
  'toplnet': {
    hex: "0x01",
    decimal: 1,
    url: "https:\\torus.topl.services"
  },
  'valhalla': {
    hex: "0x10",
    decimal: 16,
    url: "https:\\valhalla.torus.topl.services"
  },
  'hel': {
    hex: "0x20",
    decimal: 32,
    url: "https:\\hel.torus.topl.services"
  }
};

/**
 * 
 * construction of address
 * prefix 1 byte | type 1 byte | hash output 32 bytes | 4 bytes of 1-34 hash
 * 30 01 1122334455667788991011121314151617181920212223242526272829303132 2a748359
 * 
 * * prefix 1 byte | type 1 byte | hash output 32 bytes | 4 bytes of 1-34 hash
 * 10 01 1122334455667788991011121314151617181920212223242526272829303132 2a748359
 * 
 * 
 * to base58 => 25wchEp4nQ25HZ5MFTatCQP1SHrtnMmLa7SKmndRjhCJnv5
 * 25wchE base 58 gives me => 4 bytes in hex (2a748359)
 * 
 * 300111223344556677889910111213141516171819202122232425262728293031322a748359
 * 
 * 
 * end result of base 58: 86sLjaVytZKzuyCbaYQ7eh3kH56ojmXuYZE94M8GbZpU5uvFAutL
 * 
 * 25wchE
 * 
 * convert from base58 to hex
 * 
 * 
 * Add validator...
 * 
 * 
 * test:
 * this base58 to hex: 86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz
 * 30 01 a0d5cbeefe5b936f6e684f81527079e31656c2f3345f5fe2ba5d2166e5fa97c8 feb8842d
 * 
 * checksum: feb8842d
 * 
 */

function str2buf(str, enc) {
  if (!str || str.constructor !== String) return str;
  return enc ? Buffer.from(str, enc) : Buffer.from(Base58.decode(str));
}

/**
 * Check if addresses are valid by verifying these belong to the same network.
 * @param {String} networkPrefix
 * @param {Object} params
 * @param {Array} addresses
 */
/**
   * 1. verify the address is not null - DONE
   * 2. verify the base58 is 38 bytes long
   * 3. verify that it matches the network
   * 4. verify that hash matches the last 4 bytes?
   * 5. verify that address is multi-sig vs uni-sig?
   *
   * return an object
   * {
   *  success: true,
   *  errorMsg: "",
   *  networkPrefix: "local",
   *  addresses:
   *  [
  *     {
            "address": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
            "network": "local"
        },
        {
            "address": "77tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
            "network": "valhalla"
        }
   *  ]
   * }
   */

/**
 * 
 * @param {*} networkPrefix 
 * @param {*} params 
 * @param {*} addresses 
 */
/**
 * 1. verify network
 * 2. get all addresses from object
 *  a. if arr[] - then use this
 *  b. if its a jsonObj then parse this obj
 * 3. 
 */
function validateAddressesByNetwork(networkPrefix, addresses){
  // this is the response we are providing upon the completion of the validation
  let result = {
    success: false,
    errorMsg: "",
    networkPrefix: networkPrefix,
    addresses: [],
    invalidAddresses: []
  };

  // check if network is valid first
  if(!isValidNetwork(networkPrefix)){
    result.errorMsg = "Invalid network provided";
    return result;
  }

  if(!addresses){
    result.errorMsg = "No addresses provided";
    return result;
  }

  // get decimal of the network prefix
  const networkDecimal = getDecimalByNetwork(networkPrefix);

  // 2. get all addresses from object
  //  a. if arr[] - then use this
  //  b. if its a jsonObj then parse this obj
  result.addresses = addresses.constructor === Array ? addresses : extractAddressesFromObj(addresses);

  // check if addresses were obtained
  if(!result.addresses || result.addresses.length < 1){
    result.errorMsg = "No addresses found";
    return result;
  }

  // run validation on addresses
  result.addresses.forEach(address => {
    // decode base58 address
    const decodedAddress = Base58.decode(address);

    //validation: base58 38 byte obj that matches networkPrefix decimal
    if(!decodedAddress || decodedAddress.length !== 38 || decodedAddress[0] !== networkDecimal){
      result.invalidAddresses.push(address);
    }
  });

  // check if any invalid addresses were found
  if(result.invalidAddresses.length > 0){
    result.errorMsg = "Invalid addresses for network: " + networkPrefix
  } else {
    result.success = true;
  }

  return result;
}

function extractAddressesFromObj(obj){
  /**
   params =
    {
        "propositionType": "PublicKeyCurve25519",
        "changeAddress": "899tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
        "consolidationAdddress": "899tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
        "recipients": [["899tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz", 10]],
        "sender": ["899tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz"],
        "addresses": ["899tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz"],
        "fee": 1,
        "data": ""
    };
   */

   // only push unique items in array, so that validation is faster

  let addresses = [];
  if (obj.constructor === String){
    return obj;
  }
  //obj = obj;
  // if(obj.constructor === Array){
  //   obj = obj[0];
  // }

  // make this parser a bit faster, use strings or array logic
  var keys = ["recipients", "sender", "changeAddress", "consolidationAdddress", "addresses"]


  if(obj['changeAddress']){
   addresses.push(obj["changeAddress"]);
  }
  if(obj["consolidationAdddress"]){
    addresses.push(obj["consolidationAdddress"]);
  }

  if(obj["recipients"] && obj["recipients"].length > 0){
    obj["recipients"].forEach(address => {
      addresses.push(address[0]);
    });
  }
  if(obj["sender"] && obj["sender"].length > 0){
    obj["sender"].forEach(address => {
      addresses.push(address);
    });
  }
  if(obj["addresses"] && obj["addresses"].length > 0){
    obj["addresses"].forEach(address => {
      addresses.push(address);
    });
  }
  //console.log("addresses list: "+ addresses);
  return addresses;
  
}
/*** ------  TESTING FOR RAUL -------*/

let arrExample = [
  '86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz',
  '86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz',
  '86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz',
  '86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz',
  '86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz'
];
//let addValidationRes2 = validateAddressesByNetwork('local', arrExample);

let arrSingle = ['86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz'];
let addValidationRes2 = validateAddressesByNetwork('local', arrSingle);
console.log(addValidationRes2);


let paramObj =
  {
      "propositionType": "PublicKeyCurve25519",
      "changeAddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "consolidationAdddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "recipients": [["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz", 10]],
      "sender": ["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz"],
      "addresses": ["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz"],
      "fee": 1,
      "data": ""
  }
;

//extractAddressesFromObj(paramObj);
let addValidationRes = validateAddressesByNetwork('local', paramObj);
//console.log(addValidationRes);








function isValidNetwork(networkPrefix) {
  return networkPrefix && validNetworks.includes(networkPrefix);
}

function getUrlByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].url;
}

function getHexByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].hex;
}

function getDecimalByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].decimal;
}
function getValidNetworksList(networkPrefix) {
  return validNetworks;
}

// module.exports = {
//   isValidNetwork = function(networkPrefix) {
//     return networkPrefix && !validNetworks.includes(params.networkPrefix);
//   },
//   getUrlByNetwork = function(networkPrefix) {
//     return networksDefaults[networkPrefix].url;
//   },
//   getHexByNetwork = function(networkPrefix) {
//     return networksDefaults[networkPrefix].hex;
//   }
// };

module.exports = {isValidNetwork, getUrlByNetwork, getHexByNetwork, getDecimalByNetwork, getValidNetworksList};
/* ------------------------------ Generic key utils  ------------------------------ */

/**
 * Convert a string to a Buffer.  If encoding is not specified, hex-encoding
 * will be used if the input is valid hex.  If the input is valid base64 but
 * not valid hex, base64 will be used.  Otherwise, utf8 will be used.
 * @param {string} str String to be converted.
 * @param {string=} enc Encoding of the input string (optional).
 * @returns {Buffer} Buffer (bytearray) containing the input data.
 */
function str2buf(str, enc) {
  if (!str || str.constructor !== String) return str;
  return enc ? Buffer.from(str, enc) : Buffer.from(Base58.decode(str));
}

/**
 * Check if the selected cipher is available.
 * @param {string} cipher Encryption algorithm.
 * @returns {boolean} If available true, otherwise false.
 */
function isCipherAvailable(cipher) {
  return crypto.getCiphers().some(function(name) {
    return name === cipher;
  });
}

/**
 * Symmetric private key encryption using secret (derived) key.
 * @param {Buffer|string} plaintext Data to be encrypted.
 * @param {Buffer|string} key Secret key.
 * @param {Buffer|string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @returns {Buffer} Encrypted data.
 */
function encrypt(plaintext, key, iv, algo) {
  if (!isCipherAvailable(algo)) throw new Error(algo + " is not available");
  const cipher = crypto.createCipheriv(algo, str2buf(key), str2buf(iv));
  const ciphertext = cipher.update(str2buf(plaintext));
  return Buffer.concat([ciphertext, cipher.final()]);
}

/**
 * Symmetric private key decryption using secret (derived) key.
 * @param {Buffer|string} ciphertext Data to be decrypted.
 * @param {Buffer|string} key Secret key.
 * @param {Buffer|string} iv Initialization vector.
 * @param {string=} algo Encryption algorithm (default: constants.cipher).
 * @returns {Buffer} Decrypted data.
 */
function decrypt(ciphertext, key, iv, algo) {
  if (!isCipherAvailable(algo)) throw new Error(algo + " is not available");
  const decipher = crypto.createDecipheriv(algo, str2buf(key), str2buf(iv));
  const plaintext = decipher.update(str2buf(ciphertext));
  return Buffer.concat([plaintext, decipher.final()]);
}

/**
 * Calculate message authentication code from secret (derived) key and
 * encrypted text.  The MAC is the keccak-256 hash of the byte array
 * formed by concatenating the second 16 bytes of the derived key with
 * the ciphertext key's contents.
 * @param {Buffer|string} derivedKey Secret key derived from password.
 * @param {Buffer|string} ciphertext Text encrypted with secret key.
 * @returns {string} Base58-encoded MAC.
 */
function getMAC(derivedKey, ciphertext) {
  const keccak256 = (msg) => keccakHash("keccak256").update(msg).digest();
  if (derivedKey !== undefined && derivedKey !== null && ciphertext !== undefined && ciphertext !== null) {
    return keccak256(Buffer.concat([
      str2buf(derivedKey).slice(16, 32),
      str2buf(ciphertext)
    ]));
  }
}

/**
 * Generate random numbers for private key, initialization vector,
 * and salt (for key derivation).
 * @param {Object} params Encryption options.
 * @param {string} params.keyBytes Private key size in bytes.
 * @param {string} params.ivBytes Initialization vector size in bytes.
 * @returns {Object} Keys, IV and salt.
 */
function create(params) {
  const keyBytes = params.keyBytes;
  const ivBytes = params.ivBytes;

  /**
   * Create hash using Blake2b
   * @param {Object} Buffer buffer to process
   * @returns {Object} has created by blake2b
   */
  function bifrostBlake2b(Buffer) {
    return blake.createHash("blake2b", {digestLength: 32}).update(Buffer).digest();
  }

  /**
   * Generate curve25519 Key
   * @param {Object} randomBytes random bytes
   * @returns {Object} curve25519 Key as obj
   */
  function curve25519KeyGen(randomBytes) {
    const {public: pk, private: sk} = curve25519.generateKeyPair(bifrostBlake2b(randomBytes));
    return {
      publicKey: Buffer.from(pk),
      privateKey: Buffer.from(sk),
      iv: bifrostBlake2b(crypto.randomBytes(keyBytes + ivBytes + keyBytes)).slice(0, ivBytes),
      salt: bifrostBlake2b(crypto.randomBytes(keyBytes + ivBytes))
    };
  }

  return curve25519KeyGen(crypto.randomBytes(keyBytes + ivBytes + keyBytes));
}

/**
 * Derive secret key from password with key derivation function.
 * @param {String|Buffer} password User-supplied password.
 * @param {String|Buffer} salt Randomly generated salt.
 * @param {Object} [kdfParams] key-derivation parameters
 * @returns {Buffer} Secret key derived from password.
 */
function deriveKey(password, salt, kdfParams) {
  if (typeof password === "undefined" || password === null || !salt) {
    throw new Error("Must provide password and salt to derive a key");
  }

  // convert strings to Buffers
  password = str2buf(password, "utf8");
  salt = str2buf(salt);

  // get scrypt parameters
  const dkLen = kdfParams.dkLen;
  const N = kdfParams.n;
  const r = kdfParams.r;
  const p = kdfParams.p;
  const maxmem = 2 * 128 * N * r;

  return crypto.scryptSync(password, salt, dkLen, {N, r, p, maxmem});
}

/**
 * Assemble key data object in secret-storage format.
 * @param {Buffer} derivedKey Password-derived secret key.
 * @param {Object} keyObject Object containing the raw public / private keypair
 * @param {Buffer} salt Randomly generated salt.
 * @param {Buffer} iv Initialization vector.
 * @param {Buffer} algo encryption algorithm to be used
 * @returns {Object} key data object in secret-storage format
 */
function marshal(derivedKey, keyObject, salt, iv, algo) {
  // encrypt using last 16 bytes of derived key (this matches Bifrost)
  const ciphertext = encrypt(keyObject.privateKey, derivedKey, iv, algo);

  const keyStorage = {
    publicKeyId: Base58.encode(keyObject.publicKey),
    crypto: {
      cipher: algo,
      cipherText: Base58.encode(ciphertext),
      cipherParams: {iv: Base58.encode(iv)},
      mac: Base58.encode(getMAC(derivedKey, ciphertext))
    }
  };

  keyStorage.crypto.kdf = "scrypt";
  keyStorage.crypto.kdfSalt = Base58.encode(salt);

  return keyStorage;
}

/**
 * Export private key to keystore secret-storage format.
 * @param {string|Buffer} password User-supplied password.
 * @param {Object} keyObject Object containing the raw public / private keypair
 * @param {Buffer} options encryption algorithm to be used
 * @returns {Object} keyStorage for use with exportToFile
 */
function dump(password, keyObject, options) {
  const kdfParams = options.kdfParams || options.scrypt;
  const iv = str2buf(keyObject.iv);
  const salt = str2buf(keyObject.salt);
  const privateKey = str2buf(keyObject.privateKey);
  const publicKey = str2buf(keyObject.publicKey);

  return marshal(deriveKey(password, salt, kdfParams), {privateKey, publicKey}, salt, iv, options.cipher);
}

/**
 * Recover plaintext private key from secret-storage key object.
 * @param {string|Buffer} password User-supplied password.
 * @param {Object} keyStorage Keystore object.
 * @param {Object} [kdfParams] key-derivation parameters
 * @returns {Buffer} Plaintext private key.
 */
function recover(password, keyStorage, kdfParams) {
  /**
   * Verify that message authentication codes match, then decrypt
   * @param {Buffer} derivedKey Password-derived secret key.
   * @param {Buffer} iv Initialization vector.
   * @param {Object} ciphertext cipher text
   * @param {Object} mac keccak-256 hash of the byte array
   * @param {Buffer} algo encryption algorithm to be used
   * @returns {object} returns result of fn decrypt
   */
  function verifyAndDecrypt(derivedKey, iv, ciphertext, mac, algo) {
    if (!getMAC(derivedKey, ciphertext).equals(mac)) {
      throw new Error("message authentication code mismatch");
    }
    return decrypt(ciphertext, derivedKey, iv, algo);
  }

  const iv = str2buf(keyStorage.crypto.cipherParams.iv);
  const salt = str2buf(keyStorage.crypto.kdfSalt);
  const ciphertext = str2buf(keyStorage.crypto.cipherText);
  const mac = str2buf(keyStorage.crypto.mac);
  const algo = keyStorage.crypto.cipher;

  return verifyAndDecrypt(deriveKey(password, salt, kdfParams), iv, ciphertext, mac, algo);
}

/**
 * Generate filename for a keystore file.
 * @param {String} publicKey Topl address.
 * @returns {string} Keystore filename.
 */
function generateKeystoreFilename(publicKey) {
  if (typeof publicKey !== "string") throw new Error("PublicKey must be given as a string for the filename");
  const filename = new Date().toISOString() + "-" + publicKey + ".json";

  return filename.split(":").join("-");
}

