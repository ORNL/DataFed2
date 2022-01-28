#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh

# * - indicates that it is implemented
# x - indicates it has a lot of lines of code, or is a complex request
#
# Endpoints to test
# acl/update x
# acl/view
# acl/shared/list
# acl/shared/list/items

# To test the update command we will use the test_case1.sh script
# Then we will proceed to change the rules on items in that test case
