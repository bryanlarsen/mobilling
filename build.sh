#!/usr/bin/env bash

set -e
sudo docker run -it -v $(pwd):/jekyll jekyll jekyll build
cp -r _site/* ../public/
mv ../public/index.html ../public/home.html
