#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh
# Include function "convert_time_to_seconds"
#source $(dirname "$0")/../scripts/time_convert.sh
# Include function "calculate_mean_and_confidence"
#source $(dirname "$0")/../scripts/calc_stats.sh

# Group endpoints to test
# usr/authn/password
# usr/authn/token
# usr/create
# usr/update
# usr/delete
# usr/list
# usr/view
# usr/find/by_uuids
# usr/find/by_name_uid
# usr/find/by_pub_key
# usr/keys/set
# usr/keys/clear
# usr/keys/get
# usr/token/set
# usr/token/get
# usr/token/get/access
# usr/token/get/expiring
# usr/list/all
# usr/list/collab
# usr/ident/list
# usr/ident/add
# usr/ident/remove
# usr/ep/get
# usr/ep/set

# [ - represented with %5B
# ] - represented with %5D
# So array element [0] would be written as %5B0%5D

curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/usr/create?secret="my_secret"\&uid=1\&name="George"\&uuids="%5BXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX,0%5D" | jq
