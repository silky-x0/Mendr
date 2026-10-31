#!/usr/bin/env bash
# Headless Firefox captures of the prerendered site. Usage: web/scripts/capture.sh [url]
# Output: web/.captures/{desktop,mobile,narrow,nojs,nojs390,reduced}.png
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
# Firefox has no screenshot delay and animations stall while the main thread is
# busy, so the wrapper blocks its load event on a 3s-slow script from a throwaway
# local server; the iframe animates freely meanwhile.
python3 -c "
import http.server,time
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(s):
        time.sleep(3); s.send_response(200); s.send_header('Content-Type','text/javascript'); s.end_headers()
    def log_message(*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',4174),H).serve_forever()" &
SLOW=$!; trap 'kill $SLOW 2>/dev/null; rm -rf "$TMP"' EXIT
cat > "$TMP/settle.html" <<HTML
<!doctype html><body style="margin:0"><iframe src="$URL" style="border:0;width:100vw;height:100vh"></iframe>
<script src="http://127.0.0.1:4174/slow.js"></script>
HTML
TARGET=file://$TMP/settle.html shot desktop 1280 800 ''
TARGET=file://$TMP/settle.html shot mobile 390 844 ''
TARGET=file://$TMP/settle.html shot narrow 320 700 ''
shot nojs 1280 4600 'user_pref("javascript.enabled", false);'
shot nojs390 390 4400 'user_pref("javascript.enabled", false);'
shot reduced 1280 4600 'user_pref("ui.prefersReducedMotion", 1);'
echo "captures in $OUT"
