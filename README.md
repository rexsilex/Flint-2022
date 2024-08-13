# Flint-2022
JS Code Challenge Crypto Node Server/Client Example


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
SCHEMENAME = BitPayCustomAuth
```

# Usage

## Generate RSA Keys
``` npm start generate {filename} ```

## Start Server
``` npm start server {password} ```

