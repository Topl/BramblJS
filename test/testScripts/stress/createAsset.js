require("dotenv").config();
const BramblJS = require("../../../index");

const brambl = new BramblJS({
  Requests: {
    // url: 'https://valhalla.torus.topl.co/',
    // apiKey: process.env.VALHALLA_KEY
  },
  KeyManager: {
    password: "newKey"
  }
});

const arr = Array(100).fill().map((x, i) => i);

const createParams = arr.map((x) => {
  return {
    issuer: brambl.keyManager.pk,
    assetCode: x + "-test-" + Date.now(),
    recipient: brambl.keyManager.pk,
    amount: 1,
    fee: 0
  };
});


let failed = 0;
const first = async () => createParams.forEach((x) => {
  brambl.transaction("createAssetsPrototype", x)
      .then((res) => {
        console.log("Unconfirmed transaction"); console.log(res); return res;
      })
      .then((res) => brambl.pollTx(res.result.txHash))
      .then((res) => {
        console.log("\nConfirmed transaction"); console.log(res);
      })
      .catch((e) => {
        failed++; console.log("\n" + failed); console.error(e);
      });
  return failed;
});

first().then((f) => console.log(f)).catch((e) => {
  console.error(e); console.log(failed);
});
