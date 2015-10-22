#!/usr/bin/env bash

set -e

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ENV=${1:-staging}

sudo docker build -t mobilling-${ENV} $DIR/..
sudo docker run --env-file=../.env --env=DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_${ENV} --env=RAILS_ENV=${ENV} mobilling-${ENV} rake db:migrate
