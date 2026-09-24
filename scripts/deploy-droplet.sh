#!/usr/bin/env bash
# Builds the COMMITTED code (git HEAD, never uncommitted work) on this machine and ships it to the
# droplet, where the stock Node image runs it. Nothing is built on the server (1 GB RAM shared with
# another project). Rolls back automatically if the new release does not become healthy.
#
#   DEPLOY_HOST=root@<droplet-ip> bash scripts/deploy-droplet.sh
#
# The IP is deliberately not stored in the repo (it is public). See docs/deploy.md.
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. DEPLOY_HOST=root@<droplet-ip>}"
REMOTE_DIR=/opt/ixlosschool
ROOT=$(git rev-parse --show-toplevel)
SHA=$(git -C "$ROOT" rev-parse --short HEAD)
REL="$(date +%Y%m%d-%H%M%S)-$SHA"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

echo "==> Exporting $SHA (committed code only)"
git -C "$ROOT" archive HEAD | tar -x -C "$WORK"
cd "$WORK"

echo "==> Installing dependencies"
npm ci --no-audit --no-fund --loglevel=error

echo "==> Building (standalone output)"
STANDALONE=1 NEXT_TELEMETRY_DISABLED=1 npx next build > "$WORK/build.log" 2>&1 || { tail -40 "$WORK/build.log"; exit 1; }
grep -E "Compiled|Generating static pages" "$WORK/build.log" | tail -2

echo "==> Assembling the release"
APP="$WORK/release"
mkdir -p "$APP/.next"
cp -R .next/standalone/. "$APP/"
cp -R .next/static "$APP/.next/static"
cp -R public "$APP/public"
mkdir -p "$APP/.next/cache" # mount point for the image-optimizer cache volume
# Admin tools (create/reset the admin user): docker exec -it ixlos-web node tools/scripts/admin-create.mjs
mkdir -p "$APP/tools/scripts" "$APP/tools/src/lib/admin"
cp scripts/admin-create.mjs "$APP/tools/scripts/"
cp src/lib/admin/password.mjs src/lib/admin/schema.mjs "$APP/tools/src/lib/admin/"

echo "==> Swapping sharp's native binaries for linux/x64 (server runs Debian on x86_64)"
SHARP_VERSION=$(node -p "require('$APP/node_modules/sharp/package.json').version")
mkdir "$WORK/sharp-linux"
(cd "$WORK/sharp-linux" && npm init -y >/dev/null && npm i --no-audit --no-fund --loglevel=error --os=linux --cpu=x64 --libc=glibc "sharp@$SHARP_VERSION")
rm -rf "$APP/node_modules/@img"
cp -R "$WORK/sharp-linux/node_modules/@img" "$APP/node_modules/@img"

echo "==> Uploading release $REL"
ssh "$DEPLOY_HOST" "mkdir -p $REMOTE_DIR/releases/$REL"
rsync -az --delete --chmod=a+rX,u+w "$APP/" "$DEPLOY_HOST:$REMOTE_DIR/releases/$REL/"

echo "==> Switching to the new release"
ssh "$DEPLOY_HOST" bash -s -- "$REMOTE_DIR" "$REL" <<'REMOTE'
set -euo pipefail
cd "$1"; REL="$2"
PREV=$(readlink current 2>/dev/null || true)
ln -sfn "releases/$REL" current
docker compose up -d --force-recreate web >/dev/null
status=none
for _ in $(seq 1 40); do
  status=$(docker inspect -f '{{.State.Health.Status}}' ixlos-web 2>/dev/null || echo none)
  [ "$status" = healthy ] && break
  sleep 3
done
if [ "$status" != healthy ]; then
  echo "!! Release $REL did not become healthy ($status); last logs:"
  docker logs --tail 25 ixlos-web 2>&1 || true
  if [ -n "$PREV" ]; then
    echo "!! Rolling back to $PREV"
    ln -sfn "$PREV" current
    docker compose up -d --force-recreate web >/dev/null
  fi
  exit 1
fi
echo "healthy: $REL"
ls -1dt releases/* | tail -n +4 | xargs -r rm -rf # keep the 3 newest releases for rollback
REMOTE
echo "==> Done: $REL"
