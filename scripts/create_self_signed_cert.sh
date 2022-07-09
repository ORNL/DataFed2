#!/usr/bin/env bash

# This script is designed to create self signed certificates for testing, as 
# well as a token to authenticate with the web server, again for testing

ABS_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
DIR_PATH=$(dirname $ABS_PATH)

openssl req -x509 -out $DIR_PATH/cert.pem -keyout $DIR_PATH/key.pem -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

openssl rand -base64 12 > web.token
