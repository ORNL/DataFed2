#!/bin/bash

# Will randomly generate email addresses from user names
#
# Accepts data that was piped to it
# 
# E.g. 
# ./generate_usernames.sh | ./generate_email_domain_names.sh
#
# Or can accept a single command line option
# 
# ./generate_email_domain_names.sh "John Doe"
# 
# If no options are specified a random one will be generated
# 
# ./generate_email.sh
#
# Or you can pass in a file name with a bunch of user names
#
# ./generate_emails.sh names.txt
#
# Where contents of names.txt is
# John Doe
# Ellie McIntyre
# Jack Daniels

function generate_email {
        # Reading single user name from command line
        local email_domain=$($(dirname "$0")/generate_email_domain_names.sh)
        local last_name=$(echo $user_name | awk '{print $2}')
        echo "${last_name}@${email_domain}"
}


# Check to see if a pipe exists on stdin.
if [ -p /dev/stdin ]; then
        echo "Data was piped to this script!"
        # If we want to read the input line by line
        while IFS= read user_name; do
                generate_email
        done
elif [[ $# -eq 1 ]]
then
        if [ -f "$1" ]; then
						# Reading user names from a file
						echo "File passed as an argument"
						while read user_name
						do
                generate_email
						done <$1	
				else
            user_name="$1"
            generate_email
				fi
else
        echo "No input given!"
fi
