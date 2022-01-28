#!/bin/bash

source $(dirname "$0")/../scripts/config_load.sh

# * - indicates that it is implemented
# x - indicates it has a lot of lines of code, or is a complex request
#
# Endpoints to test
# task/view
# task/run x
# task/abort
# task/delete
# task/list
# task/reload
# task/purge
