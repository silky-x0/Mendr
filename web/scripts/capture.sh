#!/usr/bin/env bash
# Headless Firefox captures of the prerendered site. Usage: web/scripts/capture.sh [url]
# Output: web/.captures/{desktop,mobile,narrow,nojs,reduced}.png
set -euo pipefail
URL=${1:-http://localhost:4173}
OUT="$(cd "$(dirname "$0")/.." && pwd)/.captures"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
shot() { # name width height [pref lines...]
  local name=$1 w=$2 h=$3; shift 3
  local p="$TMP/$name"; mkdir -p "$p"; printf '%s\n' "$@" > "$p/user.js"
  firefox --headless --no-remote --profile "$p" --window-size="$w,$h" --screenshot "$OUT/$name.png" "${TARGET:-$URL}" >/dev/null 2>&1
}
# Firefox has no screenshot delay: frame the site in a wrapper whose load handler
# busy-waits 2.5s so entrance transitions settle before the capture.
cat > "$TMP/settle.html" <<HTML
<!doctype html><body style="margin:0"><iframe src="$URL" style="border:0;width:100vw;height:100vh"></iframe>
<script>addEventListener('load',()=>{const t=Date.now();while(Date.now()-t<2500);})</script>
HTML
TARGET=file://$TMP/settle.html shot desktop 1280 800 ''
TARGET=file://$TMP/settle.html shot mobile 390 844 ''
TARGET=file://$TMP/settle.html shot narrow 320 700 ''
shot nojs 1280 4600 'user_pref("javascript.enabled", false);'
shot reduced 1280 4600 'user_pref("ui.prefersReducedMotion", 1);'
echo "captures in $OUT"
