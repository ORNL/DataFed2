#!/usr/bin/env bash

# This script is designed to set up all the environmental variables that are
# needed to run the web server and other items locally as tests. It also
# assumes that the create_self_signed_cert.sh script has been called first and
# that the key.pem and cert.pem files have been placed in the current folder.
# 
# To call this script it must be sourced not run, and the web server must be
# started after this script not before.
# 
# NOTES
# 
# If using curl with a self signed certificate you will need to pass the -k 
# argument with the curl command to avoid an error.
# 
# curl -k https://127.0.0.1:8080
#

ABS_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
DIR_PATH=$(dirname $ABS_PATH)
export FWST_KEY_FILE="${DIR_PATH}/key.pem"
export FWST_CERT_FILE="${DIR_PATH}/cert.pem"
export FWST_PORT=8080
export fwst_token_secret=$(cat ${DIR_PATH}/web.token)
