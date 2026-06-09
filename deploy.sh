#!/usr/bin/env bash
# deploy.sh — SirajOne full deploy script
# Usage: bash deploy.sh [--rules-only | --all]
# Requires: git, firebase CLI, vercel CLI (all logged in)

set -euo pipefail

MODE="${1:---all}"
BRANCH="main"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║    SirajOne Deploy Script            ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. Deploy Firestore rules ──────────────────────────────────────────────────
echo "▶ Deploying Firestore rules..."
firebase deploy --only firestore:rules
echo "  ✓ Firestore rules deployed"

# ── 2. Deploy Firestore indexes ────────────────────────────────────────────────
echo "▶ Deploying Firestore indexes..."
firebase deploy --only firestore:indexes
echo "  ✓ Firestore indexes deployed"

if [[ "$MODE" == "--rules-only" ]]; then
  echo ""
  echo "✅ Rules-only deploy complete."
  exit 0
fi

# ── 3. Git: stage, commit, push ────────────────────────────────────────────────
echo ""
echo "▶ Git status:"
git status --short

echo ""
read -rp "Enter commit message (or press Enter to skip git push): " MSG

if [[ -n "$MSG" ]]; then
  git add -A
  git commit -m "$MSG"
  git push origin "$BRANCH"
  echo "  ✓ Pushed to $BRANCH"
else
  echo "  ⚠ Skipped git commit (no message provided)"
fi

echo ""
echo "✅ Deploy complete — check Vercel dashboard for build status."
echo "   https://vercel.com/dashboard"
echo ""
