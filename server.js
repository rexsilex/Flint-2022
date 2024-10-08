import http from 'http'
import crypto from 'crypto'
import process from 'process';
import { authenticate, verifySignature, hashPassword } from './utils.js';


// In-memory storage
let passwordHash = '';
const publicKeys = {};



function createServer(password) {
    passwordHash = hashPassword(password);
    const server = http.createServer((req, res) => {
        const { method } = req;

        //Storing keys should be idempotent, so use put.
        if (method === 'PUT') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    let authStatus = authenticate(req.headers.authorization, passwordHash);
                    if (authStatus !== true) {
                        res.statusCode = authStatus
                        res.end('Authentication failed.');
                    }
                    const { username, publicKey } = JSON.parse(body);
                    // Store the public key
                    publicKeys[username] = publicKey;
                    res.statusCode = 200;
                    res.end(`Public key for ${username} stored successfully`);
                } catch (e) {
                    console.log('Error parsing request body:', e);
                    res.statusCode = 400;
                    res.end('Bad request');
                }
            });


        } else if (method === "POST") { // Use post for verfiication
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const { username, message, signature } = JSON.parse(body);
                    const isValid = verifySignature(message, signature, authenticatedPublicKey);
                    if (isValid) {
                        res.statusCode = 200;
                        res.end('Signature is valid');
                    } else {
                        res.statusCode = 400;
                        res.end('Invalid signature');
                    }
                } catch (e) {
                    console.log('Error parsing request body:', e);
                    res.statusCode = 400;
                    res.end('Bad request');
                }
            });
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }

    });

    const PORT = process.env.PORT || 80; // Fallback to standard port 80 if not set

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        console.log(`Your access key to use as Authorization key is: ${passwordHash}`)
    })
}


export { createServer };