#!/usr/bin/env bash

PSQL="psql mobilling_development -t -q -c"
ROOT=/vagrant/backup/dumps

id=$1

$PSQL "copy users FROM '$ROOT/$id/users.csv' HEADER CSV;"
$PSQL "copy claims FROM '$ROOT/$id/claims.csv' HEADER CSV;"
$PSQL "copy claim_comments FROM '$ROOT/$id/claim_comments.csv' HEADER CSV;"
$PSQL "copy photos FROM '$ROOT/$id/photos.csv' HEADER CSV;"
