const Brambl = require('../../index');
const assert = require('assert');

const brambl = new Brambl('password');

describe('The Hash module', () => {
    testObj = {
        field0: 'val',
    };

    it('should return the base58 encoded hash of an object', () => {
        const objHash = brambl.utils.Hash.any({ field0: 'val' }, 'base58');
        assert.equal(objHash, 'E3qSi1MH61g53CyKqYUU1JcdCZjwL5JbvnQAvStDNMun');
    });

    it('should return the hex encoded hash of an object', () => {
        const objHash = brambl.utils.Hash.any({ field0: 'val' }, 'hex');
        assert.equal(objHash, 'c1e1ddd8c521a2b55d1919070a4b0b8d0d9dd2ada20895221d8e5170a83c676d');
    });

    it('should return the base64 encoded hash of an object', () => {
        const objHash = brambl.utils.Hash.any({ field0: 'val' }, 'base64');
        assert.equal(objHash, 'weHd2MUhorVdGRkHCksLjQ2d0q2iCJUiHY5RcKg8Z20=');
    });

    it('should return the hash of a file', () => {
        brambl.utils.Hash.file('./LICENSE.md', 'base58').then((res) =>
            assert.equal(res, 'CftuuKyGwxgwKmUEqjCdCnLwM7BjAc8hpC8BACVZg8FD'),
        );
    });

    it('should return the base58 encoded hash of a string', () => {
        const strHash = brambl.utils.Hash.any('Hello World!', 'base58');
        assert.equal(strHash, 'AYtE9sn4Qk37gVjrTjAZvb6RBARWifvcaKwL2B9WiVVm');
    });
});
