#!/usr/bin/env bash

set -e
set -x
jekyll build
cp -r _site/* ../public/
mv ../public/index.html ../public/home.html
