#!/usr/bin/env bash

cd ..
rake assets:precompile
cd phonegap
cp ../public/assets/v3.js www/js
cp ../public/assets/static.js www/js
cp ../public/assets/v3.css www/css
cp ../public/assets/react-bundle.js www/js
curl http://localhost:3000/v1/service_codes.js > www/js/service_codes.js
cordova run android
cd ..
rake assets:clobber
