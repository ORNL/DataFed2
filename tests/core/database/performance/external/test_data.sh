#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh

# * - indicates that it is implemented
# x - indicates it has a lot of lines of code, or is a complex request
#
# Endpoints to test
# dat/create x
# dat/create/batch x
# dat/update x
# dat/update/batch x
# dat/update/md_err_msg
# dat/update/size
# dat/view
# dat/export
# dat/dep/graph/get x
# dat/lock x
# dat/path
# dat/list/by_alloc
# dat/get
# dat/put
# dat/alloc_chg
# dat/owner_chg
# dat/delete x
