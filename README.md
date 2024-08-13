# Flint-2022
JS Code Challenge Crypto Node Server/Client Example

# Important notes:
Instead of using basic-auth it uses a header and an issued key.  This was for security purposes. 

# Prerequisites
1. Node (v20.16+)

## Config

### Environtment Variables
Setup a .env file for secure variables that are used with the script
- PORT: set the port you want the server to run on
- PASSPHRASE: set the passphrase to use when generating keys

```
PASSPHRASE = bitpay-ftw-2022!!
PORT = 80d
SCHEME_NAME = BitPayCustomAuth
```

# Usage

## Generate RSA Keys
``` npm start generate {username} ```

## Start Server
``` npm start server {password} ```

## Store a generated key 
Note: Be sure to generate it with the appropriate username first!
Use the access key returned from starting the server.
``` npm start submit {username} {accessKey} ```

## Sign a message
``` npm start sign {username} {message}+ ```

## Verify a message
``` npm start verify {useranme} {signature} {message}+``` 




# API

## PUT
**Stores a public key for a given username.**
Must be authenticated with an Authorization header with scheme that matches env variable and the hash provided when starting the server. 
Send a body JSON object containing the username and the public key.

## POST 
**Validates a message against stored public key.**
Does not require authorization header.
Send a body JSON object containing the username, the message and the signature. 