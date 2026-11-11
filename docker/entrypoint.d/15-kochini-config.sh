#!/bin/sh
# Runs at container start (nginx image entrypoint hook), before nginx starts.
# Writes the runtime config read by the app, and the security headers whose CSP
# must allow calls to the API origin. Everything goes to /tmp so the root
# filesystem can stay read-only.
set -eu

API_URL="${API_URL:-/api}"
APP_VERSION="${APP_VERSION:-dev}"
OUT=/tmp/kochini

# Values end up inside JavaScript and an HTTP header: accept only safe characters.
case "$API_URL" in
  http://*|https://*|/*) ;;
  *) echo "kochini: API_URL must be an http(s) URL or a path starting with / (got '$API_URL')" >&2; exit 1 ;;
esac
if printf '%s' "$API_URL" | grep -q '[^A-Za-z0-9._~:/?#@&+=%-]'; then
  echo "kochini: API_URL contains characters that are not allowed" >&2; exit 1
fi
if printf '%s' "$APP_VERSION" | grep -q '[^A-Za-z0-9._+-]'; then
  echo "kochini: APP_VERSION contains characters that are not allowed" >&2; exit 1
fi

# Same-origin path → 'self' covers it; absolute URL → allow that origin only.
case "$API_URL" in
  http*) API_ORIGIN=$(printf '%s' "$API_URL" | sed -E 's#^(https?://[^/?#]+).*#\1#') ;;
  *) API_ORIGIN="" ;;
esac

mkdir -p "$OUT"

cat > "$OUT/env-config.js" <<JS
window.__ENV__ = Object.freeze({ API_URL: "$API_URL", APP_VERSION: "$APP_VERSION" });
JS

cat > "$OUT/security-headers.inc" <<NGINX
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' $API_ORIGIN; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
NGINX

echo "kochini: config written (API_URL=$API_URL, version=$APP_VERSION)"
