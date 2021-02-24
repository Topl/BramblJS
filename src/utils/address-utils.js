/**
 * @fileOverview Utility encryption related functions for KeyManager module.
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 *
 * @exports utils isValidNetwork, getUrlByNetwork, getHexByNetwork, getDecimalByNetwork, getValidNetworksList, validateAddressesByNetwork, generateAddress
 */

"use strict";

// Dependencies
const Base58 = require("base-58");
const blake = require("blake2");

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
    url: "https://torus.topl.services"
  },
  'valhalla': {
    hex: "0x10",
    decimal: 16,
    url: "https://valhalla.torus.topl.services"
  },
  'hel': {
    hex: "0x20",
    decimal: 32,
    url: "https://hel.torus.topl.services"
  }
};

function str2buf(str, enc) {
  if (!str || str.constructor !== String) return str;
  return enc ? Buffer.from(str, enc) : Buffer.from(Base58.decode(str));
}


// TODO: include errors if the addresses are not valid. Include queue.

/**
 * Check if addresses are valid by verifying these belong to the same network.
 * @param {String} networkPrefix
 * @param {Object} params
 * @param {Array} addresses
 * 1. verify the address is not null
 * 2. verify the base58 is 38 bytes long
 * 3. verify that it matches the network
 * 4. verify that hash matches the last 4 bytes
 */
function validateAddressesByNetwork(networkPrefix, addresses){
  // response upon the completion of validation
  let result = {
    success: false,
    errorMsg: "",
    networkPrefix: networkPrefix,
    addresses: [],
    invalidAddresses: [],
    invalidChecksums: []
  };

  // check if network is valid
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

  // addresses can be passed as an array or extracted from a json obj
  result.addresses = addresses.constructor === Array ? addresses : extractAddressesFromObj(addresses);

  // check if addresses were obtained
  if(!result.addresses || result.addresses.length < 1){
    result.errorMsg = "No addresses found";
    return result;
  }

  // run validation on addresses, if address is not valid then add it to invalidAddresses array
  result.addresses.forEach(address => {
    const decodedAddress = Base58.decode(address);

    // validation: base58 38 byte obj that matches networkPrefix decimal
    if(decodedAddress.length !== 38 || decodedAddress[0] !== networkDecimal){
      result.invalidAddresses.push(address);
    } else {
      // address has correct length and matches the network, now validate the checksum
      const checksumBuffer = Buffer.from(decodedAddress.slice(34));

      // encrypt message (bytes 1-34)
      const msgBuffer = Buffer.from(decodedAddress.slice(0,34));
      const hashChecksumBuffer = blake.createHash("blake2b", {digestLength:32}).update(msgBuffer).end().read().slice(0, 4);

      // verify checksum bytes match
      if(!checksumBuffer.equals(hashChecksumBuffer)){
        result.invalidChecksums.push(address);
      }
    }
  });

  // check if any invalid addresses were found
  if(result.invalidAddresses.length > 0){
    result.errorMsg = "Invalid addresses for network: " + networkPrefix;
  } else if (result.invalidChecksums.length > 0) {
    result.errorMsg = "Addresses with invalid checksums found.";
  } else {
    result.success = true;
  }

  // TODO: Remove this console logs.
  console.log("Addresses validation result: ");
  console.log(result);

  return result;
}

function generateAddress(publicKey, networkPrefix) {
  let result = {
    success: false,
    errorMsg: "",
    networkPrefix: networkPrefix,
    address: "",
  };

  // validate Network Prefix
  if(!isValidNetwork(networkPrefix)){
    result.errorMsg = "Invalid network provided";
    return result;
  }

  // validate public key
  if(publicKey.length !== 32){
    result.errorMsg = "Invalid publicKey length";
    return result;
  }

  // include evidence with network prefix and multisig
  const networkHex = getHexByNetwork(networkPrefix);
  const netSigBytes = new Uint8Array([networkHex, '0x01']); // network decimal + multisig
  const evidence = blake.createHash("blake2b", {digestLength: 32}).update(publicKey).digest(); // hash it

  const concatEvidence = Buffer.concat([netSigBytes, evidence], 34); // insert the publicKey

  // get the hash of these 2, add first 4 bytes to the end.
  const hashChecksumBuffer = blake.createHash("blake2b", {digestLength:32}).update(concatEvidence).end().read().slice(0, 4);
  const address = Buffer.concat([concatEvidence, hashChecksumBuffer], 38);

  result.address = Base58.encode(address);
  result.success = true;
  return result;
}

function extractAddressesFromObj(obj){
  // only push unique items in array, so that validation is faster
  let addresses = [];
  if (obj.constructor === String){
    return [obj];
  }

  var addKeys = ["recipients", "sender", "changeAddress", "consolidationAdddress", "addresses"]

  addKeys.forEach(addKey => {
    if(obj[addKey] && obj[addKey].length > 0){
      if(addKey === 'recipients'){
        obj[addKey].forEach(recipient => {
          // retrieve address from tuple
          addresses = addresses.concat(recipient[0]);
        });
      } else {
        addresses = addresses.concat(obj[addKey]);
      }
    }
  });

  return addresses;
}

let paramObj =
  {
      "propositionType": "PublicKeyCurve25519",
      "changeAddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "consolidationAdddress": "86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz",
      "recipients": [["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTz", 10]],
      "sender": ["86tS2ExvjGEpS3Ntq5vZgHirUMuee7pJELGD8GmBoUyjXpAaAXTs"],
      "addresses": [],
      "fee": 1,
      "data": ""
  }
;

//extractAddressesFromObj(paramObj);
let addValidationRes = validateAddressesByNetwork('local', paramObj);
console.log(addValidationRes);

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
function getValidNetworksList() {
  return validNetworks;
}

module.exports = {isValidNetwork, getUrlByNetwork, getHexByNetwork, getDecimalByNetwork, getValidNetworksList, validateAddressesByNetwork, generateAddress};
