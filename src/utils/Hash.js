"use strict";

// Dependencies
const Base58 = require("base-58");
const blake = require("blake2");
const fs = require("fs");

// Based on JCS spec
// https://tools.ietf.org/html/draft-rundgren-json-canonicalization-scheme-17
JSON.canonify = require("canonicalize");

/**
 * standard FastCryptographicHash in Bifrost
 * @returns {Function} Initialized hash function
 */
function hashFunc() {
  return blake.createHash("blake2b", {digestLength: 32});
}

/**
 * Create hash digest and encode
 *
 * @param {object} hash Hash object
 * @param {string} [encoding] Desired output encoding. May be one of `hex`, `base64`, or `base58`. If none provided a `Buffer` is returned
 * @returns {string | object} Blake2b-256 hash digest
 */
function digestAndEncode(hash, encoding) {
  hash.end();
  switch (encoding) {
    case "hex":
    case "base64":
      return hash.read().toString(encoding);

    case "base58":
      return Base58.encode(hash.read());

    default:
      return hash.read();
  }
}

/**
 * @class
 * @classdesc Static only class to hash an input message and produce an output that matches the output of Bifrost FastCrytographicHash
 */
class Hash {
  /**
     * Calculates the Blake2b-256 hash of an arbitrary input. This function will apply JSON canonicalization to the given message.
     * Further information regarding JON canonicalization may be found at {@link https://github.com/cyberphone/json-canonicalization}
     *
     * @param {any} message input message to create the hash digest of
     * @param {string} encoding output encoding
     * @returns {function} digestAndEncode returns Blake2b-256 hash digest
     */
  static any(message, encoding) {
    const msg = Buffer.from(JSON.canonify(message));
    const hash = hashFunc().update(msg);
    return digestAndEncode(hash, encoding);
  }

  /**
     * Calculates the Blake2b-256 of a string input
     *
     * @param {string} message input string message to create the hash digest of
     * @param {string} encoding output encoding
     * @returns {function} digestAndEncode returns Blake2b-256 hash digest
     */
  static string(message, encoding) {
    const msg = Buffer.from(message);
    const hash = hashFunc().update(msg);
    return digestAndEncode(hash, encoding);
  }

  /**
     * Reads the file from disk and calculates the Blake2b-256
     *
     * @param {string} filePath path to the input file
     * @param {string} encoding output encoding
     * @returns {promise} on "finish" -> Blake2b-256 hash digest
     */
  static file(filePath, encoding) {
    return new Promise((resolve, reject) =>
      fs
          .createReadStream(filePath)
          .on("error", reject)
          .pipe(hashFunc())
          .once("finish", function() {
            resolve(digestAndEncode(this, encoding));
          })
    );
  };
}

module.exports = Hash;
