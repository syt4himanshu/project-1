#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/var/www/kys.stvincentngp.edu.in"
BACKEND_DIR="$APP_ROOT/kys-backend"
FRONTEND_DIR="$APP_ROOT/kys-frontend"
ECOSYSTEM_FILE="$APP_ROOT/ecosystem.config.js"

echo "==> Starting production deployment"
cd "$APP_ROOT"

echo "==> Syncing repository"
git pull --ff-only

echo "==> Installing backend dependencies"
npm --prefix "$BACKEND_DIR" ci

echo "==> Installing frontend dependencies"
npm --prefix "$FRONTEND_DIR" ci

echo "==> Building frontend (fresh dist)"
rm -rf "$FRONTEND_DIR/dist"
npm --prefix "$FRONTEND_DIR" run build

echo "==> Ensuring frontend is not managed by PM2"
pm2 delete kys-frontend >/dev/null 2>&1 || true

echo "==> Reloading backend via PM2"
pm2 startOrReload "$ECOSYSTEM_FILE" --only kys-backend --update-env

echo "==> Validating and reloading NGINX"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Saving PM2 process list"
pm2 save

echo "==> Deployment finished successfully"
