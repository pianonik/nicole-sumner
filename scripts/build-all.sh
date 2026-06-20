#!/usr/bin/env bash
# ============================================================
# build-all.sh — regenerate ALL site data from the deck, in order.
# This is the build step of a deploy: run it, commit, push.
#
#   ./scripts/build-all.sh
#
# Order matters: build-videos.js reads the link map that
# build-images.js writes (js/images.js), so images must run first.
# Prereq: the deck is unzipped into assets/_extract/unpacked (see README).
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[1/3] build-images.js       — per-slide links, covers, flat slide JPGs"
node scripts/build-images.js

echo "[2/3] build-videos.js       — gather every YouTube link into the video gallery"
node scripts/build-videos.js

echo "[3/3] build-slides-html.js  — faithful HTML render of every slide"
node scripts/build-slides-html.js

echo "✓ All site data regenerated. Now: commit and push to deploy."
