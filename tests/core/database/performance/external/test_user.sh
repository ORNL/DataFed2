#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh
# Include function "convert_time_to_seconds"
#source $(dirname "$0")/../scripts/time_convert.sh
# Include function "calculate_mean_and_confidence"
#source $(dirname "$0")/../scripts/calc_stats.sh

# * - indicates that it is implemented
# x - indicates it has a lot of lines of code, or is a complex request
#
# Group endpoints to test
# usr/authn/password
# usr/authn/token
# usr/create * x
# usr/update
# usr/delete * x
# usr/list *
# usr/view * x
# usr/find/by_uuids
# usr/find/by_name_uid
# usr/find/by_pub_key
# usr/keys/set *
# usr/keys/clear
# usr/keys/get *
# usr/token/set
# usr/token/get
# usr/token/get/access
# usr/token/get/expiring
# usr/list/all *
# usr/list/collab x
# usr/ident/list
# usr/ident/add
# usr/ident/remove
# usr/ep/get
# usr/ep/set

# [ - represented with %5B
# ] - represented with %5D
# So array element [0] would be written as %5B0%5D

# Start by listing current users
response=$(curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/list/all)

echo "$response" | jq .[]

uids=$(echo "$response" | jq .[].uid)
# Generate random user name
uid=1
str_uid="u/$uid"
comparison_uid="\"u/$uid\""
user_name=$($(dirname "$0")/../../scripts/generate_usernames.sh)
email=$($(dirname "$0")/../../scripts/generate_emails.sh $user_name)
uuid=$($(dirname "$0")/../../scripts/generate_uuids.sh)

# Generate keys
if [ -f "id_rsa" ] 
then
  rm id_rsa
fi
if [ -f "id_rsa.pub" ] 
then
  rm id_rsa.pub
fi

ssh-keygen -f id_rsa -N ""
sed -i '1d' id_rsa
priv_key=$(head -n 36 id_rsa | sed -z 's/\n//g' )
#priv_key=$(echo "$priv_key" | sed -r 's/ /\+/g')
pub_key=$(cat id_rsa.pub | awk '{print $2}')

# If the user already exists remove them
for inc_uid in ${uids}
do
  echo "inc_uid $inc_uid"
  echo "str_uid $comparison_uid"
  if [ "$comparison_uid" = "$inc_uid" ]
  then

    echo "Are equal $str_uid = $inc_uid"
    response=$(curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/delete?client=$uid)
    echo "$response"
  fi
done

response=$(curl -X POST -u root:"" --header 'accept: application/json' --data-binary @- http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/create << EOF
{
  "secret": "dummysecret",
  "uid": "$uid",
  "name": "$user_name",
  "email": "$email",
  "uuids": ["$uuid"],
  "is_admin": true
}
EOF)

echo "/usr/create"
echo $response


response=$(curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/view?client=$uid)

echo "/usr/view"
echo $response

response=$(curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/keys/set?client=$uid\&pub_key=$pub_key\&priv_key=$priv_key)

echo "/usr/keys/set"
echo $response

response=$(curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/keys/get?client=$uid)

echo "/usr/keys/get"
echo $response


