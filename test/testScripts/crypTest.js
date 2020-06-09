const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const password = 'Password used to generate key';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);

let encrypted = '';
cipher.on('readable', () => {
    let chunk;
    while (null !== (chunk = cipher.read())) {
        encrypted += chunk.toString('hex');
    }
});
cipher.on('end', () => {
    console.log(encrypted);
    console.log(encrypted.length);
});

const msg = 'some clear text data. This is another message';
const msgBuff = Buffer.from(msg);

console.log(msgBuff.length);
cipher.write(msg);
cipher.end();
