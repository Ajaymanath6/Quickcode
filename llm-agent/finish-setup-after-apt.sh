#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)'; then
  echo "Python 3.10+ required" >&2
  exit 1
fi

create_venv() {
  if python3 -m venv .venv; then
    return 0
  fi
  echo "ensurepip unavailable; creating venv without pip..." >&2
  python3 -m venv --without-pip .venv
  curl -sS https://bootstrap.pypa.io/get-pip.py | .venv/bin/python
}

if [[ ! -x .venv/bin/python ]]; then
  rm -rf .venv
  if ! create_venv; then
    echo "Could not create llm-agent/.venv." >&2
    echo "On Debian/Ubuntu: sudo apt install python3.10-venv python3-pip" >&2
    echo "Then re-run: bash llm-agent/finish-setup-after-apt.sh" >&2
    exit 1
  fi
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt
echo "llm-agent .venv ready"
