require('dotenv').config()
const BramblJS = require('../index')
const assert = require("assert")



const brambljs = new BramblJS({
    Requests: {
        url: 'https://valhalla.torus.topl.co/',
        apiKey: process.env.VALHALLA_KEY
    },
    KeyManager: {
        password: 'password',
        // keyPath: 'keyfile.json'
    }
})

const publicKey = ""

describe("Keyfile", () => {
    it("should return a newly generated keyfile", done => {
        brambljs.requests
            .generateKeyfile({password:"password"})
            .then(response => {
                console.log(response)
                console.log(response)
                assert.equal(typeof response.result, "object");

                done();
            })
            .catch(error => {
                console.log(error);
            });
    }).timeout("10000");

    // it("should return a successfully locked keyfile", done => {
    //   brambljs.requests
    //     .lockKeyfile({publicKey:"5PZH3DbnhUJKyFEJXvYTBBjfBLt9TCwAbWLaYTFpKV9x", password:"password"})
    //     .then(response => {
    //         console.log(response);
    //         assert.equal(typeof response.result, "object");
    //         done();
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });
    // }).timeout("10000");
    it("should return a successfully unlocked keyfile", done => {
        brambljs.requests
            .unlockKeyfile({publicKey:"5PZH3DbnhUJKyFEJXvYTBBjfBLt9TCwAbWLaYTFpKV9x", password:"password"})
            .then(response => {
                console.log(response)
                assert.equal(typeof response.result, "object");
                done();
            })
            .catch(error => {
              console.log(error);
            });
    }).timeout("10000")
    it("should return a list of open keyfiles", function(done){
        brambljs.requests
            .listOpenKeyfiles()
            .then(response => {
                assert.equal(typeof response, "object");
                done();
            })
            .catch(error => {
              console.log(error);
            });
    });
    it("should return a chain info object", done =>{
        brambljs.requests
            .chainInfo()
            .then(response => {
                console.log(response)
                assert.equal(typeof response.result, "object");
                done();
            })
            .catch(error => {
              console.log(error);
            });
    })

    it("should return a balances by key", done => {
        brambljs.requests
            .getBalancesByKey({publicKeys:["5JE9iAdUZtHzaz7So1azbaJcXt521GDSk2553FFxqihL"]})
            .then(response => {
                console.log(response)
                assert.equal(typeof response.result, "object");
                done();
            })
            .catch(error => {
              console.log(error);
        });
    })
    it("should return a the block creation delay by key", done => {
        brambljs.requests
        .calcDelay({blockId: '6LPtWEm5CRzcjcqJKym9ByKPRYWvBYy7P3DHeE4K7F2r', numBlocks:100})
        .then(response => {
            console.log(response)
            assert.equal(typeof response.result, "object");
            done();
          })
          .catch(error => {
            console.log(error);
          })
    })
    it("should return a the block creation delay by key", done => {
        brambljs.requests
        .calcDelay({blockId: '6LPtWEm5CRzcjcqJKym9ByKPRYWvBYy7P3DHeE4K7F2r', numBlocks:100})
        .then(response => {
            console.log(response)

            assert.equal(typeof response.result, "object");
            done();
            
        })
        .catch(error => {
          console.log(error);
        });
    })
})
