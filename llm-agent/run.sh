#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/llm-agent"
if [[ -f .env.llm ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.llm
  set +a
elif [[ -f "$ROOT/.env.llm" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env.llm"
  set +a
fi
if [[ ! -x .venv/bin/python ]]; then
  echo "Missing llm-agent/.venv. Run: bash llm-agent/finish-setup-after-apt.sh" >&2
  exit 1
fi
PYVER="$(.venv/bin/python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
python3 -c "import sys; raise SystemExit(0 if tuple(map(int, '${PYVER}'.split('.'))) >= (3, 10) else 1)"
exec .venv/bin/uvicorn main:app --host 127.0.0.1 --port 4302 --reload
