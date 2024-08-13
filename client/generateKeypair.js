import crypto from 'crypto';
import process from 'node:process';

function generateKeypair() {
    const options = {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: process.env.PASSPHRASE,
        },
    };

    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('rsa', options, (error, publicKey, privateKey) => {
            if (error) {
                reject(error);
            } else {
                resolve({ publicKey, privateKey });
            }
        });
    });
}

export default generateKeypair;