#!/usr/bin/env bash
# Local + CI quality gate. Run from repo root: bash scripts/ci.sh
# Optional: bash scripts/ci.sh --skip-build
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help)
      echo "Usage: bash scripts/ci.sh [--skip-build]"
      echo "  --skip-build  Skip sitemap + vite build (faster local loop)"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: bash scripts/ci.sh [--skip-build]" >&2
      exit 1
      ;;
  esac
done

step() {
  echo
  echo "==> $*"
}

if [[ ! -d node_modules ]]; then
  echo "node_modules missing. Run npm ci (or npm install) first." >&2
  exit 1
fi

step "Compile markdown content"
node scripts/compile-content.mjs
node scripts/generate-builtin-answers.mjs

step "Question catalog, schema, and contest IDs"
node scripts/generate-question-catalog.mjs
node scripts/check-questions.mjs
node scripts/check-contest-ids.mjs

step "Official solutions through rustc"
node scripts/check-rust-harnesses.mjs

step "ESLint"
npx eslint . --max-warnings 0

step "Typecheck app"
npx tsc -b

step "Typecheck worker"
npx tsc -p functions --noEmit

step "Security smoke"
node scripts/security_smoke.mjs

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  step "Sitemap + production build"
  node scripts/generate-sitemap.js
  npx vite build
else
  echo
  echo "==> Skipping sitemap + vite build (--skip-build)"
fi

echo
echo "All checks passed."
