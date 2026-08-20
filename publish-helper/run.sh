#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/publish-helper"
if [[ -x "$ROOT/llm-agent/.venv/bin/python" ]]; then
  PY="$ROOT/llm-agent/.venv/bin/python"
else
  PY=python3
fi
exec "$PY" -m uvicorn main:app --host 127.0.0.1 --port 4301
