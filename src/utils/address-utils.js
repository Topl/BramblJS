/**
 * @fileOverview Utility encryption related functions for KeyManager module.
 *
 * @author Raul Aragonez (r.aragonez@topl.me)
 *
 * @exports utils isValidNetwork, getUrlByNetwork, getHexByNetwork, getDecimalByNetwork, getValidNetworksList, validateAddressesByNetwork, generatePubKeyHashAddress
 */

"use strict";

// Dependencies
const Base58 = require("base-58");
const blake = require("blake2");

const validNetworks = ["local", "private", "toplnet", "valhalla", "hel"];

// TODO: support custom define network
const networksDefaults = {
  "local": {
    hex: "0x30",
    decimal: 48,
    url: "http://localhost:9085/"
  },
  "private": {
    hex: "0x40",
    decimal: 64,
    url: "http://localhost:9085/"
  },
  "toplnet": {
    hex: "0x01",
    decimal: 1,
    url: "https://torus.topl.services"
  },
  "valhalla": {
    hex: "0x10",
    decimal: 16,
    url: "https://valhalla.torus.topl.services"
  },
  "hel": {
    hex: "0x20",
    decimal: 32,
    url: "https://hel.torus.topl.services"
  }
};

// TODO: include errors if the addresses are not valid. Include queue.

/**
 * Check if addresses are valid by verifying:
 * 1. verify the address is not null
 * 2. verify the base58 is 38 bytes long
 * 3. verify that it matches the network
 * 4. verify that hash matches the last 4 bytes
 * @param {String} networkPrefix prefix of network to validate against
 * @param {Array} addresses list of addresses to run validation against
 * @returns {object} result obj returned as json
 */
function validateAddressesByNetwork(networkPrefix, addresses) {
  // response upon the completion of validation
  const result = {
    success: false,
    errorMsg: "",
    networkPrefix: networkPrefix,
    addresses: [],
    invalidAddresses: [],
    invalidChecksums: []
  };

  // check if network is valid
  if (!isValidNetwork(networkPrefix)) {
    result.errorMsg = "Invalid network provided";
    return result;
  }

  if (!addresses) {
    result.errorMsg = "No addresses provided";
    return result;
  }

  // get decimal of the network prefix
  const networkDecimal = getDecimalByNetwork(networkPrefix);

  // addresses can be passed as an array or extracted from a json obj
  result.addresses = addresses.constructor === Array ? addresses : extractAddressesFromObj(addresses);

  // check if addresses were obtained
  if (!result.addresses || result.addresses.length < 1) {
    result.errorMsg = "No addresses found";
    return result;
  }

  // run validation on addresses, if address is not valid then add it to invalidAddresses array
  result.addresses.forEach((address) => {
    const decodedAddress = Base58.decode(address);

    // validation: base58 38 byte obj that matches networkPrefix decimal
    if (decodedAddress.length !== 38 || decodedAddress[0] !== networkDecimal) {
      result.invalidAddresses.push(address);
    } else {
      // address has correct length and matches the network, now validate the checksum
      const checksumBuffer = Buffer.from(decodedAddress.slice(34));

      // encrypt message (bytes 1-34)
      const msgBuffer = Buffer.from(decodedAddress.slice(0, 34));
      const hashChecksumBuffer = blake.createHash("blake2b", {digestLength: 32}).update(msgBuffer).end().read().slice(0, 4);

      // verify checksum bytes match
      if (!checksumBuffer.equals(hashChecksumBuffer)) {
        result.invalidChecksums.push(address);
      }
    }
  });

  // check if any invalid addresses were found
  if (result.invalidAddresses.length > 0) {
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

/**
 * Generate Hash Address using the Public Key and Network Prefix
 * @param {Buffer} publicKey base58 buffer of public key
 * @param {String} networkPrefix prefix of network where address will be used
 * @returns {object} result obj returned as json
 */
function generatePubKeyHashAddress(publicKey, networkPrefix) {
  const result = {
    success: false,
    errorMsg: "",
    networkPrefix: networkPrefix,
    address: ""
  };

  // validate Network Prefix
  if (!isValidNetwork(networkPrefix)) {
    result.errorMsg = "Invalid network provided";
    return result;
  }

  // validate public key
  if (publicKey.length !== 32) {
    result.errorMsg = "Invalid publicKey length";
    return result;
  }

  // include evidence with network prefix and multisig
  const networkHex = getHexByNetwork(networkPrefix);
  const netSigBytes = new Uint8Array([networkHex, "0x01"]); // network decimal + multisig
  const evidence = blake.createHash("blake2b", {digestLength: 32}).update(publicKey).digest(); // hash it

  const concatEvidence = Buffer.concat([netSigBytes, evidence], 34); // insert the publicKey

  // get the hash of these 2, add first 4 bytes to the end.
  const hashChecksumBuffer = blake.createHash("blake2b", {digestLength: 32}).update(concatEvidence).end().read().slice(0, 4);
  const address = Buffer.concat([concatEvidence, hashChecksumBuffer], 38);

  result.address = Base58.encode(address);
  result.success = true;
  return result;
}

/**
 * Parse obj to retrieve addresses from the following keys:
 * ["recipients", "sender", "changeAddress", "consolidationAdddress", "addresses"]
 *
 * @param {object} obj json obj to retrieve addresses from
 * @returns {Array} list of addresses found in object
 */
function extractAddressesFromObj(obj) {
  // only push unique items in array, so that validation is faster
  let addresses = [];
  if (obj.constructor === String) {
    return [obj];
  }

  const addKeys = ["recipients", "sender", "changeAddress", "consolidationAdddress", "addresses"];

  addKeys.forEach((addKey) => {
    if (obj[addKey] && obj[addKey].length > 0) {
      if (addKey === "recipients") {
        obj[addKey].forEach((recipient) => {
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

/**
 *
 * @param {string} address address to be used to create asset code
 * @param {string} assetName name of assets, up to 8 bytes long latin-1 enconding
 */
function createAssetCode(address, assetName) {
  /**
   *
      00 4001d55f806be2759a3523d7b83ca9288396e8df521466212c80168509f638847b40 04303030

         40 01 d55f806be2759a3523d7b83ca9288396e8df521466212c80168509f638847b40 - 187ff961

      fn(){
      01
      34 bytes of address
      + 8 bytes max for name

      in latin-1 encoding
      }

      ::fixed width - include zeros to make it 8 bytes long::

      1. get address in base58
      2. ignore network prefix
      3. ignore the checksum
      4. get assetName and convert to bytes, concat 0's at the beginning to make it 8 bytes long
      5. concat 01 + 34 bytes of address + asset name
      6. return result in enconded base58
   */
}

/**
 * @param {String} networkPrefix prefix of network to validate against
 * @returns {boolean} true if network is valid and is included in the valid networks obj
 */
function isValidNetwork(networkPrefix) {
  return networkPrefix && validNetworks.includes(networkPrefix);
}

/**
 * @param {String} networkPrefix prefix of network to validate against
 * @returns {String} url of network
 */
function getUrlByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].url;
}

/**
 * @param {String} networkPrefix prefix of network to validate against
 * @returns {hex} hexadecimal value of network
 */
function getHexByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].hex;
}

/**
 * @param {String} networkPrefix prefix of network to validate against
 * @returns {String} hexadecimal value of network
 */
function getDecimalByNetwork(networkPrefix) {
  return networksDefaults[networkPrefix].decimal;
}

/**
 * @param {String} networkPrefix prefix of network to validate against
 * @returns {object} json obj of valid networks
 */
function getValidNetworksList() {
  return validNetworks;
}

module.exports = {isValidNetwork, getUrlByNetwork, getHexByNetwork, getDecimalByNetwork, getValidNetworksList, validateAddressesByNetwork, generatePubKeyHashAddress, createAssetCode};
