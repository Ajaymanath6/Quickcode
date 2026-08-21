from theme_context.assembler import assemble
from theme_context.palette import live_palette


def test_smart_includes_palette_and_chunks() -> None:
    text = assemble(
        "primary button spacing",
        theme_snapshot={"primary": "#111111"},
        mode="smart",
    )
    assert "brandcolor-primary" in text
    assert "Theme context (smart)" in text
    assert "Guide chunks" in text or "Token help" in text


def test_legacy_fallback_mode() -> None:
    text = assemble("anything", mode="legacy")
    assert "legacy" in text.lower()
    assert "Theme Guide V2" in text or "brandcolor-primary" in text


def test_palette_override() -> None:
    colors = live_palette({"colors": {"primary": "#ff0000"}})
    assert colors["primary"] == "#ff0000"


def test_legacy_scale_keys_map_to_semantic() -> None:
    colors = live_palette({"700": "#abcdef"})
    assert colors["primary"] == "#abcdef"
