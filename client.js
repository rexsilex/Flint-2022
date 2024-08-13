import fs from 'fs';
import path from 'path';
import http from 'http';
import generateKeypair from "./client/generateKeypair.js";
import { createServer } from "./server.js";
import { getKey } from "./utils.js";

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
    case 'server':
        let password;
        if (args.length > 1) {
            password = args[1]
        } else {
            console.log("You must supply a password when starting the server.");
            break;
        }
        createServer(password);
        break;

    case 'submit':
        let username;
        let hash;
        let key;

        if (args.length > 2) {
            username = args[1]
            hash = args[2]
            key = getKey(username)
            if (key == null) {
                console.log("Failed to find key with that username.");
                break;
            }
        } else {
            console.log("You must supply all arguments to submit a new key")
            break;
        }
        const options = {
            hostname: 'localhost',
            port: process.env.PORT,
            path: '',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SCHEME_NAME + ' ' + hash
            }
        };

        const contents = { username: username, publicKey: key }
        let body = JSON.stringify(contents);
        const req = http.request(options, (res) => {
            res.on('data', () => {
                console.log('Response received');
                if (res.statusCode === 200) {
                    console.log(`Public key for ${username} stored successfully.`)
                } else {
                    console.log('Error submitting public key, please see server logs for details.');
                }
            });
        });

        req.on('error', (e) => {
            console.log('Problem with request: ' + e.message);
        });
        console.log(body);
        req.write(body);
        req.end();
        console.log('Request sent.');
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
        console.log('No command entered. Available commands: [generate, sign, verify, server]')
}

