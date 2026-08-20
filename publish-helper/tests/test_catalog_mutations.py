import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import main  # noqa: E402


def _client(tmp_path: Path) -> TestClient:
    blueprints = tmp_path / "blueprints"
    blueprints.mkdir()
    catalog = blueprints / "_catalog.json"
    catalog.write_text("[]", encoding="utf-8")
    main.BLUEPRINTS = str(blueprints)
    main.CATALOG = str(catalog)
    return TestClient(main.app)


def test_publish_update_and_delete(tmp_path: Path) -> None:
    client = _client(tmp_path)
    created = client.post(
        "/api/publish",
        json={
            "componentId": "canvas:card:demo",
            "label": "Demo card",
            "sourceHtml": "<div>hello</div>",
            "description": "first",
            "kind": "component",
            "blueprint": {"kind": "card", "data": {"note": "keep"}},
        },
    )
    assert created.status_code == 200
    listed = client.get("/api/catalog").json()
    assert listed[0]["label"] == "Demo card"
    blueprint_path = Path(main.BLUEPRINTS) / "canvas-card-demo.json"
    assert blueprint_path.is_file()
    stored = json.loads(blueprint_path.read_text(encoding="utf-8"))
    assert stored["blueprint"]["data"]["note"] == "keep"
    assert stored["blueprint"]["data"]["imageAlt"] == "Demo card"

    updated = client.post(
        "/api/publish",
        json={
            "componentId": "canvas:card:demo",
            "label": "Demo card v2",
            "sourceHtml": "<div>hello</div>",
            "description": "second",
            "kind": "component",
            "blueprint": {"kind": "card"},
        },
    )
    assert updated.status_code == 200
    listed = client.get("/api/catalog").json()
    assert len(listed) == 1
    assert listed[0]["label"] == "Demo card v2"

    deleted = client.delete("/api/catalog/canvas:card:demo")
    assert deleted.status_code == 200
    assert client.get("/api/catalog").json() == []
    assert not blueprint_path.exists()


def test_import_layout_html_payload(tmp_path: Path) -> None:
    client = _client(tmp_path)
    response = client.post(
        "/api/publish",
        json={
            "componentId": "layout-home",
            "label": "Home layout",
            "sourceHtml": "<main>page</main>",
            "kind": "layout",
            "blueprint": {"refs": ["canvas:card:demo"]},
        },
    )
    assert response.status_code == 200
    entry = client.get("/api/catalog").json()[0]
    assert entry["isLayout"] is True
    assert entry["kind"] == "layout"
