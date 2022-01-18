# Will install foxx

current_dir=$(dirname "$0")
cd ${current_dir}/../database
pwd
touch passwd

# Create the sdms database using HTTP, not sure how to do this from foxx because
# We cannot mount a foxx service without the database existing as far as I know.

# Step 1 list existing databases
response=$(curl -X GET -u root:"" --header 'accept: application/json'  http://172.22.1.206:8529/_api/database)
databases=$(echo $response | jq '.result | .[]')
for word in ${databases}
do
  if [[ $word == *"sdms"* ]]
  then
    # If it exists drop it because we want to start clean
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
