#!/usr/bin/env bash

set -e
set -x

sudo docker build -t mobilling .

sudo docker run --env-file=.env mobilling rake db:migrate
