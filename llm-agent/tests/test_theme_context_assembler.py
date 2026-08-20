from theme_context.assembler import assemble
from theme_context.palette import live_palette


def test_smart_includes_palette_and_chunks() -> None:
    text = assemble("primary button spacing", theme_snapshot={"700": "#111111"}, mode="smart")
    assert "brandcolor-700" in text
    assert "Theme context (smart)" in text
    assert "Guide chunks" in text or "Token help" in text


def test_legacy_fallback_mode() -> None:
    text = assemble("anything", mode="legacy")
    assert "legacy" in text.lower()


def test_palette_override() -> None:
    colors = live_palette({"colors": {"700": "#ff0000"}})
    assert colors["700"] == "#ff0000"
