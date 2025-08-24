#!/usr/bin/env bash
set -euo pipefail

# Install chromium for Puppeteer
if ! command -v chromium-browser >/dev/null 2>&1; then
  echo "Installing chromium..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq chromium-browser
fi

export CHROME_BIN=$(which chromium-browser || which chromium)
echo "CHROME_BIN=${CHROME_BIN}"

# Start loader server in background
node scripts/loader_server.js &
LOADER_PID=$!
echo "Started loader_server (pid=${LOADER_PID})"

sleep 1

# Run the puppeteer script (it will exit 0 on success)
node scripts/puppeteer_sidenav_test.js

# Cleanup
kill ${LOADER_PID} >/dev/null 2>&1 || true
