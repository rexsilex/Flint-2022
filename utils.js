import fs from 'fs'
import path from 'path'
import crypto from 'crypto';


function getKey(username, type) {
    const keyPath = path.join('storage', 'keys', `${username}.${type}`);

    if (type == 'pub') {
        try {
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
            return publicKey;
        } catch (e) {
            console.error(`Error reading public key for ${username}: ${e}`);
            return null;
        }
    } else {
        try {
            const encryptedKey = fs.readFileSync(keyPath, 'utf8');
            const privateKey = crypto.privateDecrypt(
                {
                    key: encryptedKey,
                    passphrase: process.env.PASSPHRASE,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                },
                Buffer.from('')
            ).toString('utf8');

            return privateKey;
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.error(`Error: Private key file for ${username} not found.`);
            } else {
                console.error(`Error reading private key for ${username}: ${e}`);
            }
            return null;
        }
    }
}
function authenticate(authHeader, passwordHash) {
    if (!authHeader) {
        return 401;
    }
    const [scheme, authKey] = authHeader.split(' ');
    if (scheme != process.env.SCHEME_NAME || authKey !== passwordHash) {
        return 403;
    }
    return true;
}
function verifySignature(message, signature, publicKey) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(message);
    return verifier.verify(publicKey, signature, 'base64');
}

async function generateSignature(username, message) {
    try {
        const privateKeyPem = getKey(username, 'priv');
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(message);
        const signature = signer.sign(privateKeyPem, 'base64');

        return signature;
    } catch (error) {
        console.error('Error generating signature:', error);
        throw error;
    }
}

function hashPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
}

export { getKey, authenticate, verifySignature, generateSignature, hashPassword };