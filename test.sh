#!/usr/bin/env bash
# Acceptance tests for Deploy Weather. Usage: bash test.sh
set -u
S="$(cd "$(dirname "$0")" && pwd)/deploy-weather.mjs"
D=$(mktemp -d); cd "$D"
git init -q -b main && git config user.email t@t.t && git config user.name t
mkdir -p force-app/main/default/{classes,triggers,lwc/banner,permissionsets}
echo "// base" > force-app/main/default/classes/A.cls; echo x > README.md
git add . && git commit -qm base
fail=0
check() { if [[ "$2" == *"$3"* ]]; then echo "PASS: $1"; else echo "FAIL: $1 (got: $2)"; fail=1; fi; }
check "no changes" "$(node "$S")" "☀️  Sunny: no changes found"
git checkout -qb sunny; echo "<template></template>" > force-app/main/default/lwc/banner/banner.html
git add . && git commit -qm s
out=$(node "$S"); check "lwc sunny" "$out" "Sunny: touches 1 LWC component"
git checkout -qb cloudy main; echo "// edit" >> force-app/main/default/classes/A.cls
git add . && git commit -qm c
out=$(node "$S"); check "apex cloudy" "$out" "Cloudy: touches 1 Apex class"
git checkout -qb stormy main
echo "trigger T on Account (before insert){}" > force-app/main/default/triggers/T.trigger
echo "<x/>" > force-app/main/default/permissionsets/P.permissionset-meta.xml
git rm -q force-app/main/default/classes/A.cls; git add . && git commit -qm st
out=$(node "$S"); check "stormy" "$out" "Stormy:"
out=$(node "$S" --json); check "json" "$out" '"forecast":"Stormy"'
node "$S" --fail-on-stormy >/dev/null; code=$?
if [[ $code -eq 1 ]]; then echo "PASS: fail-on-stormy exit 1"; else echo "FAIL: fail-on-stormy exit $code"; fail=1; fi
node "$S" nope >/dev/null 2>&1; code=$?
if [[ $code -eq 2 ]]; then echo "PASS: bad base exit 2"; else echo "FAIL: bad base exit $code"; fail=1; fi
rm -rf "$D"
exit $fail
