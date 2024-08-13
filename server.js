import http from 'http'
import crypto from 'crypto'
import process from 'process';



// In-memory storage
let passwordHash;
const publicKeys = {};

function hashPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
}

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
                    let authStatus = authenticate(req.headers.authorization);
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
            //TODO 
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

function authenticate(authHeader, res) {
    if (!authHeader) {
        return 401;
    }
    const [scheme, authKey] = authHeader.split(' ');
    if (scheme != process.env.SCHEME_NAME || authKey !== passwordHash) {
        return 403;
    }
    return true;
}

export { createServer };