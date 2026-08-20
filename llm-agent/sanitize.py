import re

from schemas import CANVAS_HTML_MAX_CHARS

_SCRIPT = re.compile(r"<script[\s\S]*?</script>", re.IGNORECASE)
_ONATTR = re.compile(r"\son\w+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", re.IGNORECASE)
_JSURL = re.compile(r"javascript:", re.IGNORECASE)


def strip_fences(text: str) -> str:
    stripped = (text or "").strip()
    if stripped.startswith("```"):
        lines = stripped.split("\n")
        inner = "\n".join(lines[1:])
        if inner.rstrip().endswith("```"):
            inner = inner.rstrip()[:-3]
        stripped = inner.strip()
    return stripped


def sanitize_html(html: str) -> str:
    cleaned = strip_fences(html or "")
    cleaned = _SCRIPT.sub("", cleaned)
    cleaned = _ONATTR.sub("", cleaned)
    cleaned = _JSURL.sub("", cleaned)
    if len(cleaned) > CANVAS_HTML_MAX_CHARS:
        cleaned = cleaned[:CANVAS_HTML_MAX_CHARS]
    return cleaned.strip()
