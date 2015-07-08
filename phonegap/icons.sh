#!/usr/bin/env bash

mkdir -p res/ios
cd res/ios
convert ../MoBillingLogo2.svg -resize 180x180 icon-60@3x.png
convert ../MoBillingLogo2.svg -resize 60x60 icon-60.png
convert ../MoBillingLogo2.svg -resize 120x120 icon-60@2x.png
convert ../MoBillingLogo2.svg -resize 76x76 icon-76.png
convert ../MoBillingLogo2.svg -resize 152x152 icon-76@2x.png
convert ../MoBillingLogo2.svg -resize 40x40 icon-40.png
convert ../MoBillingLogo2.svg -resize 80x80 icon-40@2x.png
convert ../MoBillingLogo2.svg -resize 57x57 icon.png
convert ../MoBillingLogo2.svg -resize 114x114 icon@2x.png
convert ../MoBillingLogo2.svg -resize 72x72 icon-72.png
convert ../MoBillingLogo2.svg -resize 144x144 icon-72@2x.png
convert ../MoBillingLogo2.svg -resize 29x29 icon-small.png
convert ../MoBillingLogo2.svg -resize 58x58 icon-small@2x.png
convert ../MoBillingLogo2.svg -resize 50x50 icon-50.png
convert ../MoBillingLogo2.svg -resize 100x100 icon-50@2x.png

convert ../MoBillingLogo2.svg -resize 320x480 -background white -gravity center -extent 320x480 Default~iphone.png
convert ../MoBillingLogo2.svg -resize 640x960 -background white -gravity center -extent 640x960 Default@2x~iphone.png
convert ../MoBillingLogo2.svg -resize 768x1024 -background white -gravity center -extent 768x1024 Default-Portrait~ipad.png
convert ../MoBillingLogo2.svg -resize 1536x2048 -background white -gravity center -extent 1536x2048 Default-Portrait@2x~ipad.png
convert ../MoBillingLogo2.svg -resize 1024x768 -background white -gravity center -extent 1024x768 Default-Landscape~ipad.png
convert ../MoBillingLogo2.svg -resize 2048x1536 -background white -gravity center -extent 2048x1536 Default-Landscape@2x~ipad.png
convert ../MoBillingLogo2.svg -resize 640x1136 -background white -gravity center -extent 640x1136 Default-568h@2x~iphone.png
convert ../MoBillingLogo2.svg -resize 750x1334 -background white -gravity center -extent 750x1334 Default-667h.png
convert ../MoBillingLogo2.svg -resize 1242x2208 -background white -gravity center -extent 1242x2208 Default-736h.png
convert ../MoBillingLogo2.svg -resize 2208x1242 -background white -gravity center -extent 2208x1242 Default-Landscape-736h.png

mkdir -p ../android
cd ../android
convert ../MoBillingLogo2.svg -resize 160x160 mdpi.png
convert ../MoBillingLogo2.svg -resize 240x240 hdpi.png
convert ../MoBillingLogo2.svg -resize 320x320 xhdpi.png
convert ../MoBillingLogo2.svg -resize 490x490 xxhdpi.png
convert ../MoBillingLogo2.svg -resize 640x640 xxxhdpi.png


cd ../..

