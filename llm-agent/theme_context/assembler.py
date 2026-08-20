from typing import Any, Dict, Optional

from theme_context.chunks import load_guide_chunks
from theme_context.config import (
    THEME_CONTEXT_EXTENDED_MAX_CHARS,
    THEME_CONTEXT_MAX_CHARS,
    THEME_CONTEXT_MODE,
)
from theme_context.palette import live_palette
from theme_context.rule_retriever import retrieve_chunks
from theme_context.tailwind_filter import filtered_tailwind_snippet
from theme_context.token_help import token_help_snippets
from theme_context.vector_retriever import retrieve_vectors


def assemble(
    prompt: str,
    theme_snapshot: Optional[Dict[str, Any]] = None,
    extended: bool = False,
    mode: Optional[str] = None,
) -> str:
    cap = THEME_CONTEXT_EXTENDED_MAX_CHARS if extended else THEME_CONTEXT_MAX_CHARS
    chosen = (mode or THEME_CONTEXT_MODE or "smart").lower()
    try:
        if chosen == "rag":
            return _cap(_rag(prompt, theme_snapshot, extended), cap)
        if chosen == "legacy":
            return _cap(_legacy(extended), cap)
        return _cap(_smart(prompt, theme_snapshot, extended), cap)
    except Exception:
        if chosen == "rag":
            try:
                return _cap(_smart(prompt, theme_snapshot, extended), cap)
            except Exception:
                return _cap(_legacy(extended), cap)
        return _cap(_legacy(extended), cap)


def _smart(prompt: str, theme_snapshot: Optional[Dict[str, Any]], extended: bool) -> str:
    palette = live_palette(theme_snapshot)
    chunks = retrieve_chunks(prompt, load_guide_chunks())
    help_bits = token_help_snippets(prompt)
    lines = ["Theme context (smart):", "Palette:"]
    for key, value in palette.items():
        lines.append(f"- brandcolor-{key}: {value}")
    lines.append("Guide chunks:")
    for chunk in chunks:
        lines.append(f"- {chunk.text}")
    lines.append("Token help:")
    lines.extend(f"- {bit}" for bit in help_bits)
    if extended:
        snippet = filtered_tailwind_snippet()
        if snippet:
            lines.append("tailwind.config.js (truncated):")
            lines.append(snippet)
    return "\n".join(lines)


def _legacy(extended: bool) -> str:
    chunks = load_guide_chunks()
    text = "Theme context (legacy):\n" + "\n".join(chunk.text for chunk in chunks)
    if extended:
        text += "\n" + filtered_tailwind_snippet()
    return text


def _rag(prompt: str, theme_snapshot: Optional[Dict[str, Any]], extended: bool) -> str:
    vector_chunks = retrieve_vectors(prompt)
    base = _smart(prompt, theme_snapshot, extended)
    extra = "\n".join(chunk.text for chunk in vector_chunks)
    return base + "\nRAG:\n" + extra


def _cap(text: str, cap: int) -> str:
    return text if len(text) <= cap else text[:cap]
