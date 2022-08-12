#!/bin/bash

# Ensure rig is installed
# sudo apt-get update
# sudo apt-get install rig
#
# Pass in the number of user names to be generated

num_user_names=1
if [[ $# -eq 1 ]]
then
  num_user_names=$1
fi

rig -c $num_user_names | awk 'NR % 5 == 1 {print}'
