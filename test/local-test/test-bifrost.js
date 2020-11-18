/**
* An quick app to test brambljs fetched from NPM
* @author: Raul Aragonez
**/

// Dependencies
// const BramblJS = require('./src/brambljs');
const BramblJS = require("../../index");

// Init
const brambl = new BramblJS("PASSWORD");

// This is using the Requests module
const requests = BramblJS.Requests();

requests.chainInfo().then(console.log).catch(console.error);
