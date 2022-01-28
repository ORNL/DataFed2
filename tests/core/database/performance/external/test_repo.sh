#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh

# * - indicates that it is implemented
# x - indicates it has a lot of lines of code, or is a complex request
#
# Endpoints to test
# repo/list
# repo/view
# repo/create
# repo/update
# repo/delete
# repo/calc_size
# repo/list/by_repo
# repo/list/by_owner
# repo/alloc/view
# repo/alloc/stats
# repo/alloc/create
# repo/alloc/delete
# repo/alloc/set
# repo/alloc/set/default
