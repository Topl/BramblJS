require("dotenv").config();
const BramblJS = require("../../index");

const brambl = new BramblJS({
  Requests: {
    url: "https://valhalla.torus.topl.co/",
    apiKey: process.env.VALHALLA_KEY
  },
  KeyManager: {
    password: "genesis",
    keyPath: "./keystore/itGuy.json"
  }
});

const createParams = {
  issuer: brambl.keyManager.pk,
  assetCode: "test-" + Date.now(),
  recipient: brambl.keyManager.pk,
  amount: 1,
  fee: 0
};

brambl.transaction("createAssetsPrototype", createParams)
    .then((res) => {
      console.log("Unconfirmed transaction"); console.log(res); return res;
    })
    .then((res) => brambl.pollTx(res.result.txHash))
    .then((res) => {
      console.log("\nConfirmed transaction"); console.log(res);
    })
    .catch(console.log);
