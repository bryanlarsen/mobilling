#!/usr/bin/env bash

PSQL="psql mobilling_production -t -q -c"
ROOT=/vagrant/backup/dumps

for id in `$PSQL "select id from users;"`; do
    mkdir -p $ROOT/$id
    chmod a+w $ROOT/$id
    $PSQL "copy (select * from users where id = '$id') to '$ROOT/$id/users.csv' CSV HEADER;"
    $PSQL "copy (select * from claims where user_id = '$id') to '$ROOT/$id/claims.csv' CSV HEADER;"
    $PSQL "copy (select claim_comments.* from claim_comments inner join claims on claim_comments.claim_id = claims.id where claims.user_id = '$id') to '$ROOT/$id/claim_comments.csv' CSV HEADER;"
    $PSQL "copy (select * from photos where user_id = '$id') to '$ROOT/$id/photos.csv' CSV HEADER;"
done
