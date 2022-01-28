#!/bin/bash

# Will randomly generate an email domain name
# 
# One argument can be passed in to specify how many email domains to generate
# The all_email_provider_domains.txt file must be present
# 
# The file was provided by https://gist.github.com/ammarshah/f5c2624d767f91a7cbdc4e54db8dd0bf

function create_email_domain {
  local number_of_domains_to_generate=1
  if [[ $# -eq 1 ]]
  then
    number_of_domains_to_generate=$1
  fi

  local domain_file=$(dirname "$0")/all_email_provider_domains.txt
  local number_domains=$(wc -l $domain_file | awk '{print $1}')

  # Get a random number
  RANDOM=$$

  for i in `seq $number_of_domains_to_generate`
  do
    RANDOM_IN_SCOPE=$(($RANDOM % $number_domains))
    sed ''"$RANDOM_IN_SCOPE"','"$RANDOM_IN_SCOPE"'!d' $domain_file
  done
}

create_email_domain $1
