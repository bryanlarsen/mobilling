#!/usr/bin/env bash
set -e

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ENV=${1:-staging}
shift
OUTDIR=/var/mo-billing
APP=mo-billing
RUN_OPTIONS=-P --env-file=.env --env=DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_${ENV} --env=RAILS_ENV=${ENV} -v ${OUTDIR}/public/uploads:/app/public/uploads

CONTAINER=$(sudo docker run -d ${RUN_OPTIONS})
echo CONTAINER ${CONTAINER}
sudo docker cp ${CONTAINER}:/app/public ${OUTDIR}/
sudo cp -rp ${OUTDIR}/dist/* ${OUTDIR}/public/static/

# it should be safe to copy/paste from here into billohip or threekit's run.sh
IP=$(sudo docker inspect ${CONTAINER} | jq -r ".[0].NetworkSettings.IPAddress")
echo IP ${IP}
sed -e 's/%IP%/'"${IP}"'/g' -e 's/%HOSTS%/'"${HOSTS}"'/g' -e 's/%ENV%/'"${ENV}"'/g' ${DIR}/nginx-${ENV}.conf > /tmp/nginx.conf
sudo cp /tmp/nginx.conf /etc/nginx/sites-available/${APP}-${CONTAINER}-${ENV}.conf
sudo ln -sf /etc/nginx/sites-available/${APP}-${CONTAINER}-${ENV}.conf /etc/nginx/sites-enabled/${APP}-${ENV}.conf

sleep 5
sudo service nginx reload

sudo mkdir -p ${OUTDIR}/${ENV}
sudo docker stop $(cat ${OUTDIR}/${ENV}/previous) || true
sudo rm /etc/nginx/sites-available/${APP}-$(cat ${OUTDIR}/${ENV}/previous)-${ENV}.conf || true

sudo mv ${OUTDIR}/${ENV}/current ${OUTDIR}/${ENV}/previous || true
echo ${CONTAINER} | sudo tee ${OUTDIR}/${ENV}/current > /dev/null

