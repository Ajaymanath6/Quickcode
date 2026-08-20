import json

import pytest

from generate_code import GenerateCodeError, normalize_name, resolve_catalog, _source_html


def test_normalize_strips_spaces_and_underscores() -> None:
    assert normalize_name("Canvas_card") == normalize_name("canvas card")


def test_instant_path_returns_source_html() -> None:
    entries = [
        {
            "id": "canvas-card-1",
            "label": "Product card",
            "imageAlt": "Product card",
            "sourceHtml": "<article class='card'>ok</article>",
        }
    ]
    hit, _ = resolve_catalog("productcard", entries)
    assert hit is not None
    assert _source_html(hit) == "<article class='card'>ok</article>"


def test_ambiguous_409() -> None:
    entries = [
        {"id": "a", "label": "Card", "sourceHtml": "<div>a</div>"},
        {"id": "b", "label": "card", "sourceHtml": "<div>b</div>"},
    ]
    with pytest.raises(GenerateCodeError) as err:
        resolve_catalog("card", entries)
    assert err.value.status == 409


def test_temp_catalog_file(tmp_path, monkeypatch) -> None:
    catalog = tmp_path / "_catalog.json"
    catalog.write_text(
        json.dumps(
            [{"id": "x", "label": "Hero", "sourceHtml": "<h1>Hero</h1>"}]
        ),
        encoding="utf-8",
    )
    monkeypatch.setattr("generate_code.CATALOG_PATH", str(catalog))
    hit, _ = resolve_catalog("hero")
    assert hit is not None
    assert "Hero" in _source_html(hit)
