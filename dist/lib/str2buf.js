"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_58_1 = __importDefault(require("base-58"));
function str2buf(str, enc) {
    switch (str.constructor) {
        case Buffer:
            return isBuffer(str);
        case Uint8Array:
            return isUint(str);
        case String:
            return isStr(str, enc);
        default:
            throw new Error('Input type is not one of ["string", "Buffer", "Uint8Array"]');
    }
}
function isBuffer(str) {
    return str;
}
function isUint(str) {
    return Buffer.from(str);
}
function isStr(str, enc) {
    switch (enc) {
        case 'utf8':
        case 'hex':
        case 'base64':
            return Buffer.from(str, enc);
        case 'base58':
        default:
            return Buffer.from(base_58_1.default.decode(str));
    }
}
exports.default = str2buf;
