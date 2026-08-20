from typing import List

from theme_context.models import ThemeChunk


def retrieve_chunks(prompt: str, chunks: List[ThemeChunk], limit: int = 4) -> List[ThemeChunk]:
    lower = (prompt or "").lower()
    scored = []
    for chunk in chunks:
        score = sum(1 for word in chunk.keywords if word.lower() in lower)
        scored.append((score if score else 0, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    picked = [chunk for score, chunk in scored if score > 0][:limit]
    if not picked:
        return chunks[: min(limit, len(chunks))]
    return picked
