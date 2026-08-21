import json
import os
from typing import List

KNOWLEDGE = os.path.join(os.path.dirname(__file__), "..", "knowledge", "token-help.json")


def token_help_snippets(prompt: str, limit: int = 4) -> List[str]:
    path = os.path.abspath(KNOWLEDGE)
    if not os.path.isfile(path):
        return [
            "Use bg-brandcolor-primary text-brandcolor-white for primary actions; "
            "p-card-pad-default for card inset."
        ]
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    items = data.get("tokens", [])
    lower = (prompt or "").lower()
    matched = [
        str(item.get("help", ""))
        for item in items
        if any(k in lower for k in item.get("keywords", []))
    ]
    if not matched:
        matched = [str(item.get("help", "")) for item in items[:limit]]
    return [text for text in matched if text][:limit]
