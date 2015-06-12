#!/usr/bin/env bash
set -e
set -x
CONTAINER=$(sudo docker run -d --env-file=.env -v /var/mo-billing/public/uploads:/app/public/uploads mobilling)
echo CONTAINER ${CONTAINER}
sudo docker cp ${CONTAINER}:/app/public /var/mo-billing

IP=$(sudo docker inspect ${CONTAINER} | jq -r ".[0].NetworkSettings.IPAddress")
echo IP ${IP}
sed -e "s/%IP%/${IP}/g" nginx.conf > /tmp/mo-billing.conf
sudo cp /tmp/mo-billing.conf /etc/nginx/sites-enabled/mo-billing.conf
sudo service nginx reload
