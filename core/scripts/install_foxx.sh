#!/bin/bash

# This script will be used to install foxx from scratch. That is assuming the
# "sdms" database does not exist. If it does it exist it will first be removed
# before the script proceeds to recreate it and intall Foxx.
# In this way it is idempotent.

current_dir=$(dirname "$0")
cd ${current_dir}/../database
pwd
touch passwd


# Step 1 list existing databases
response=$(curl -X GET -u root:"" --header 'accept: application/json'  http://172.22.1.206:8529/_api/database)
databases=$(echo $response | jq '.result | .[]')
for word in ${databases}
do
  # If the "sdms" database exists drop it because we want to start clean
  if [[ $word == *"sdms"* ]]
  then
    # Create the sdms database using HTTP, not sure how to do this from foxx because
    # We cannot mount a foxx service without the database existing as far as I know.
    response=$(curl -X DELETE -u root:"" --header 'accept: application/json'  http://172.22.1.206:8529/_api/database/sdms)
  fi
done

# Step 2. create the database from scratch
response=$(curl -X POST -u root:"" --header 'accept: application/json' --data-binary @- --dump - http://172.22.1.206:8529/_api/database <<EOF 
{ 
  "name" : "sdms", 
  "options" : { 
    "sharding" : "flexible", 
    "replicationFactor" : 3 
  } 
}
EOF
)

# Step 3. install foxx services
foxx install /api --database sdms --password-file passwd

rm passwd
