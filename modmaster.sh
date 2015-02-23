#!/bin/bash

sScript="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/modmaster.php";
php "$sScript" "$@"; 