require("dotenv").config();
const BramblJS = require("../../index");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const brambl = new BramblJS({
  // Requests: {
  //     url: 'https://valhalla.torus.topl.co:9585/',
  //     apiKey: process.env.VALHALLA_KEY
  // },
  KeyManager: {
    password: "genesis",
    keyPath: "./keystore/itGuy.json"
  }
});

const createParams = {
  issuer: brambl.keyManager.pk,
  assetCode: "topiies",
  recipient: brambl.keyManager.pk,
  amount: 1,
  fee: 0
};

const maxTxs = 50;
const timeToNextSet = 10*1000; // ms
const startFlag = true;
const txTypes = ["createAssetsPrototype\", \"transferAssetsPrototype"];

setInterval(() => {
  console.log("\nIssuing transactions...");
  const timeBetweenTx = Math.floor( timeToNextSet / getRandomInt(maxTxs));
  let counter = 0;

  const createTx = setInterval(() => {
    counter++;
    // const txToSend = txTypes % getRandomInt(txTypes.length - 1)
    const txToSend = txTypes[0];
    brambl.transaction(txToSend, createParams).catch((e)=>console.error(e));
  }, timeBetweenTx);

  setTimeout(() => {
    console.log(`Issued ${counter} transactions this period`);
    clearInterval(createTx);
  }, timeToNextSet);
}, timeToNextSet);
