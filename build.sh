#!/usr/bin/env bash

set -e
set -x
docker run -it -v $(pwd):/srv/jekyll jekyll/jekyll:3.6.2 jekyll build
cp -r _site/* ../public/
mv ../public/index.html ../public/home.html
