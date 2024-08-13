import generateKeypair from "./client/generateKeypair.js";
const args = process.argv.slice(2)
let command = null;
let message = null;

if (args.length > 0) {
    command = args[0];
    message = args.slice(1).join(' ');
}
console.log(`Executing command: ${command}`)
switch (command) {
    case 'generate':
        generateKeypair().then(({ publicKey, privateKey }) => {
            console.log('Public Key:', publicKey);
            console.log('Private Key:', privateKey);
        })
            .catch((err) => {
                console.error('Error generating key pair:', err);
            });
        break;
    case 'sign':
        signMessage(message);
        break;
    case 'verify':
        verifyMessage(message);
        break;
    case null:
        // Command missing, do default
        console.log('No command entered. Available commands: [generate, sign, verify]')
}

