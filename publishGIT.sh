#!/usr/bin/env bash
rm -rf ./lib
cp -rf ../build_ES2015_CommonJS ./lib
git add lib
git add package.json
git add publishGIT.sh
git commit -m "update"

