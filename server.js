import http from 'http'
import crypto from 'crypto'
import process from 'process';



// In-memory storage
let passwordHash;

function hashPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    console.log(salt);
}

function createServer(password) {
    passwordHash = hashPassword(password);
    const server = http.createServer((req, res) => {
        const { method } = req;

        res.end('Hello World!');

    });

    const PORT = process.env.PORT || 80; // Fallback to standard port 80 if not set

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export { createServer };