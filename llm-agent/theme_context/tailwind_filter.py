import os
from typing import Optional

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TAILWIND = os.path.join(REPO_ROOT, "tailwind.config.js")


def filtered_tailwind_snippet(max_chars: int = 1200) -> str:
    if not os.path.isfile(TAILWIND):
        return ""
    with open(TAILWIND, encoding="utf-8") as handle:
        text = handle.read()
    return text[:max_chars]
