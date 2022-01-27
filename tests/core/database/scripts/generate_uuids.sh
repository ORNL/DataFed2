#!/bin/bash

# Script is designed to randomly generate alpha numeric uuids
#
# Pass in the number of uuids to be generated

num_uuids=1
if [[ $# -eq 1 ]]
then
  num_uuids=$1
fi

RANDOM=$$
for i in `seq $num_uuids`
do
  field1=$(echo $RANDOM | md5sum | head -c 8)
  field2=$(echo $RANDOM | md5sum | head -c 4)
  field3=$(echo $RANDOM | md5sum | head -c 4)
  field4=$(echo $RANDOM | md5sum | head -c 4)
  field5=$(echo $RANDOM | md5sum | head -c 12)
  echo  "${field1}-${field2}-${field3}-${field4}-${field5}"
done
