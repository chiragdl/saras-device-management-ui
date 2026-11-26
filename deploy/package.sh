#!/usr/bin/env bash
# Builds the portal frontend for hosting:
#   dist/                                      IIS: copy into the site folder (web.config and config.json included)
#   out/saras-device-portal-web-<version>.zip  Azure App Service: zip deploy of the same files
#   AWS (S3 + CloudFront): hosting/aws/upload-website.sh dist <bucket> <api address> <distribution id>
# Before deploying, set "apiBaseUrl" in dist/config.json if the API has its own host name
# (and add that host to connect-src in dist/web.config).
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"
VERSION="$(node -p "require('./package.json').version")"
ZIP="$HERE/out/saras-device-portal-web-$VERSION.zip"
npm run lint
npm run build
mkdir -p "$HERE/out"
rm -f "$ZIP"
(cd dist && zip -qr "$ZIP" .)
echo
echo "IIS folder : $HERE/dist"
echo "Azure zip  : $ZIP"
