import json
import os
from typing import List

from theme_context.models import ThemeChunk

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
GUIDE_PATH = os.path.join(REPO_ROOT, "public", "theme-guide.json")


def load_guide_chunks() -> List[ThemeChunk]:
    if not os.path.isfile(GUIDE_PATH):
        return [
            ThemeChunk(
                id="fallback",
                keywords=["color", "brand"],
                text="Use brandcolor-50/100 fills, brandcolor-700 actions, white shells.",
            )
        ]
    with open(GUIDE_PATH, encoding="utf-8") as handle:
        data = json.load(handle)
    chunks: List[ThemeChunk] = []
    for item in data.get("chunks", []):
        chunks.append(
            ThemeChunk(
                id=str(item.get("id", "chunk")),
                keywords=[str(k) for k in item.get("keywords", [])],
                text=str(item.get("text", "")),
            )
        )
    return chunks or [
        ThemeChunk(id="empty", keywords=["theme"], text=str(data)[:800])
    ]
