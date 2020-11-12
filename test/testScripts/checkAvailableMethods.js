const BramblJS = require('../../index.js')

const brambl = new BramblJS('test')
const bramblLayer = BramblJS.Requests()
const gjal = BramblJS.KeyManager('test')

function getAllFuncs(toCheck) {
    var props = [];
    var obj = toCheck;
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) {
       if (e!=arr[i+1] && typeof toCheck[e] == 'function') return true;
    });
}

[brambl, bramblLayer, gjal].map(x => console.log(getAllFuncs(x)))
