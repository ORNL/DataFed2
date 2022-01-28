#!/bin/bash


source $(dirname "$0")/config_load.sh

curl -X POST -u root:"" --header 'accept: application/json' --data-binary @- http://${arango_ip_addr}:${arango_port}/_db/sdms/_api/document/config << EOF
{ 
  "_key": "system",
  "secret": "dummysecret"
} 
EOF
