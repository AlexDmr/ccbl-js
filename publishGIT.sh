#!/usr/bin/env bash
rm -rf ./lib
cp -rf ../build_ES2020_ES2020/nf ./lib
git add lib
git add package.json
git add publishGIT.sh
git commit -m "update"
#git push
