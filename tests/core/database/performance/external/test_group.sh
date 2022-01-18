#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh
# Include function "convert_time_to_seconds"
#source $(dirname "$0")/../scripts/time_convert.sh
# Include function "calculate_mean_and_confidence"
#source $(dirname "$0")/../scripts/calc_stats.sh

# Group endpoints to test
# grp/create
# grp/update
# grp/delete
# grp/list
# grp/view

curl -X GET -u root:"" --header 'accept: application/json' http://${arango_ip_addr}:${arango_port}/_db/sdms/api/grp/create?client=8888-8888\&gid=1 | jq
