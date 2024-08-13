import generateKeypair from "./client/generateKeypair.js";
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2)
let command = null;
let message = null;

if (args.length > 0) {
    command = args[0];
}


console.log(`Executing command: ${command}`)

switch (command) {
    case 'generate':
        let requestedFilename;
        let privateKeyPath;
        let publicKeyPath;

        if (args.length > 1) {
            requestedFilename = args[1]
            privateKeyPath = path.join('storage', 'keys', `${requestedFilename}.priv`)
            publicKeyPath = path.join('storage', 'keys', `${requestedFilename}.pub`)
        } else {
            console.log('You must provide a filename argument when generating a new key.');
            console.log('Try using: npm start generate myname')
            break;
        }

        generateKeypair().then(({ publicKey, privateKey }) => {
            console.log('Public Key:', publicKey);
            // console.log('Private Key:', privateKey);
            // if you don't use sync, then the callback will fail
            fs.writeFileSync(privateKeyPath, privateKey);
            fs.writeFileSync(publicKeyPath, publicKey);
        })
            .catch((err) => {
                console.error('Error generating key pair:', err);
            });
        break;
    case 'sign':
        // TODO (flint)
        signMessage(message);
        break;
    case 'verify':
        // TODO (flint)
        verifyMessage(message);
        break;
    case null:
        // Command missing, do default
        console.log('No command entered. Available commands: [generate, sign, verify]')
}

