import fs from 'fs'
import path from 'path'

function getKey(username) {
    const publicKeyPath = path.join('storage', 'keys', `${username}.pub`);

    try {
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        return publicKey;
    } catch (e) {
        console.error(`Error reading public key for ${username}: ${e}`);
        return null;
    }
}

export { getKey };