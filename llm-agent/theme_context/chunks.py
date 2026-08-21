import json
import os
from typing import List

from theme_context.models import ThemeChunk

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_GUIDE_PATH = os.path.join(REPO_ROOT, "src", "config", "theme-guide.json")
PUBLIC_FALLBACK_PATH = os.path.join(REPO_ROOT, "public", "theme-guide.json")


def _guide_path() -> str:
    override = os.environ.get("THEME_GUIDE_PATH", "").strip()
    if override and os.path.isfile(override):
        return override
    if os.path.isfile(DEFAULT_GUIDE_PATH):
        return DEFAULT_GUIDE_PATH
    return PUBLIC_FALLBACK_PATH


def _fallback_chunks() -> List[ThemeChunk]:
    return [
        ThemeChunk(
            id="fallback",
            keywords=["color", "brand", "primary"],
            text=(
                "Use bg-brandcolor-primary for CTAs, text-brandcolor-textstrong for headings, "
                "border-brandcolor-strokeweak for cards, bg-brandcolor-fill for page chrome."
            ),
        )
    ]


def _chunks_from_v2(data: dict) -> List[ThemeChunk]:
    chunks: List[ThemeChunk] = []
    theme_colors = data.get("themeColors")
    if isinstance(theme_colors, dict):
        for key, meta in theme_colors.items():
            if not isinstance(meta, dict):
                continue
            when = meta.get("whenToUse") or []
            keywords = [str(key), "color", "brand"]
            keywords.extend(str(item).lower() for item in when[:6])
            utilities = meta.get("utilityClasses") or {}
            util_text = ", ".join(str(v) for v in utilities.values())
            text = (
                f"{key} ({meta.get('hex', '')}): {meta.get('usage', '')}. "
                f"Classes: {util_text}. "
                f"When: {'; '.join(str(item) for item in when[:4])}."
            )
            chunks.append(ThemeChunk(id=str(key), keywords=keywords, text=text.strip()))

    guidelines = data.get("componentGuidelines")
    if isinstance(guidelines, dict):
        for name, meta in guidelines.items():
            if not isinstance(meta, dict):
                continue
            keywords = [str(name), "component"]
            if name == "button":
                keywords.extend(["cta", "primary", "neutral"])
            text_parts = [f"Component {name}:"]
            if "completeClasses" in meta:
                text_parts.append(str(meta["completeClasses"]))
            if "classes" in meta:
                text_parts.append(str(meta["classes"]))
            primary = meta.get("primary")
            if isinstance(primary, dict) and primary.get("completeClasses"):
                text_parts.append("primary: " + str(primary["completeClasses"]))
            neutral = meta.get("neutral")
            if isinstance(neutral, dict) and neutral.get("completeClasses"):
                text_parts.append("neutral: " + str(neutral["completeClasses"]))
            styling = meta.get("styling")
            if isinstance(styling, dict):
                text_parts.append("styling: " + ", ".join(f"{k}={v}" for k, v in styling.items()))
            rules = meta.get("criticalRules") or []
            if rules:
                text_parts.append("rules: " + "; ".join(str(r) for r in rules[:4]))
            chunks.append(
                ThemeChunk(id=f"component-{name}", keywords=keywords, text=" ".join(text_parts))
            )

    ai = data.get("aiInstructions")
    if isinstance(ai, dict):
        rules = ai.get("criticalRules")
        if isinstance(rules, dict):
            bits = []
            for rule_meta in rules.values():
                if isinstance(rule_meta, dict) and rule_meta.get("rule"):
                    bits.append(str(rule_meta["rule"]))
            if bits:
                chunks.append(
                    ThemeChunk(
                        id="ai-critical-rules",
                        keywords=["rules", "hex", "inline", "forbidden", "ai"],
                        text="AI critical rules: " + " | ".join(bits),
                    )
                )
        workflow = ai.get("workflow")
        if isinstance(workflow, list) and workflow:
            chunks.append(
                ThemeChunk(
                    id="ai-workflow",
                    keywords=["workflow", "guide", "tailwind"],
                    text="AI workflow: " + " → ".join(str(step) for step in workflow),
                )
            )

    chunks.append(
        ThemeChunk(
            id="spacing",
            keywords=["spacing", "gap", "padding", "card", "micro", "cozy"],
            text=(
                "Prefer spacing tokens micro/tight/cozy/section/hero/inline and "
                "card-pad-* / card-gap-*. Avoid raw p-4/gap-2 when theme tokens fit."
            ),
        )
    )
    return chunks


def _chunks_from_legacy(data: dict) -> List[ThemeChunk]:
    chunks: List[ThemeChunk] = []
    for item in data.get("chunks", []):
        chunks.append(
            ThemeChunk(
                id=str(item.get("id", "chunk")),
                keywords=[str(k) for k in item.get("keywords", [])],
                text=str(item.get("text", "")),
            )
        )
    return chunks


def load_guide_chunks() -> List[ThemeChunk]:
    path = _guide_path()
    if not os.path.isfile(path):
        return _fallback_chunks()
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        return _fallback_chunks()
    if "themeColors" in data or "componentGuidelines" in data:
        chunks = _chunks_from_v2(data)
    else:
        chunks = _chunks_from_legacy(data)
    return chunks or _fallback_chunks()


def load_guide_raw_text(max_chars: int = 12000) -> str:
    path = _guide_path()
    if not os.path.isfile(path):
        return _fallback_chunks()[0].text
    with open(path, encoding="utf-8") as handle:
        text = handle.read()
    return text if len(text) <= max_chars else text[:max_chars]
