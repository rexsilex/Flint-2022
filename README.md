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
PORT = 80
SCHEME_NAME = BitPayCustomAuth
```

# Usage

## Generate RSA Keys
``` npm start generate {username} ```

## Start Server
``` npm start server {password} ```

## Store a generated key 
Note: Be sure to generate it with the appropriate username first!
Use the access eky returned from starting the server.
``` npm start submit {username} {accessKey} ```





# API

## PUT
Stores a public key for a given username. 

## POST 
Validates a message against stored public key