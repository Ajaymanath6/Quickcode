"""Helpers for layout allowlist notes."""

from typing import List


def allowlist_note(ids: List[str]) -> str:
    if not ids:
        return "No published catalog refs allowed — chrome/scaffolding only."
    return "Catalog refs must be one of: " + ", ".join(ids[:40])
