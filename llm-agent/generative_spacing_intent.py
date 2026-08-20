"""Detect whether a second spacing pass is worthwhile."""

SPACING_HINTS = ("padding", "gap", "spacing", "tight", "cozy", "hero", "inset")


def wants_spacing_pass(prompt: str, enforcement: bool) -> bool:
    if not enforcement:
        return False
    lower = (prompt or "").lower()
    return any(hint in lower for hint in SPACING_HINTS) or enforcement
