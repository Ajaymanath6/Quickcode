import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG = os.path.join(ROOT, "public", "blueprints", "_catalog.json")
BLUEPRINTS = os.path.join(ROOT, "public", "blueprints")

app = FastAPI(title="QuickCode publish helper")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PublishBody(BaseModel):
    componentId: str = Field(min_length=1, max_length=200)
    label: str = Field(min_length=1, max_length=160)
    sourceHtml: str
    description: Optional[str] = None
    sealed: Optional[bool] = None
    kind: str = "component"
    blueprint: Dict[str, Any] = {}


def _read() -> List[Dict[str, Any]]:
    if not os.path.isfile(CATALOG):
        return []
    with open(CATALOG, encoding="utf-8") as handle:
        data = json.load(handle)
    return data if isinstance(data, list) else []


def _write(entries: List[Dict[str, Any]]) -> None:
    os.makedirs(BLUEPRINTS, exist_ok=True)
    temporary = f"{CATALOG}.tmp"
    with open(temporary, "w", encoding="utf-8") as handle:
        json.dump(entries, handle, indent=2)
    os.replace(temporary, CATALOG)


def _safe_id(component_id: str) -> str:
    return "".join(
        character if character.isalnum() or character in "-_." else "-"
        for character in component_id
    )


def _write_json(path: str, value: Dict[str, Any]) -> None:
    temporary = f"{path}.tmp"
    with open(temporary, "w", encoding="utf-8") as handle:
        json.dump(value, handle, indent=2)
    os.replace(temporary, path)


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.get("/api/catalog")
def catalog() -> List[Dict[str, Any]]:
    return _read()


@app.post("/api/publish")
def publish(body: PublishBody) -> dict:
    os.makedirs(BLUEPRINTS, exist_ok=True)
    safe_id = _safe_id(body.componentId)
    bp_name = f"{safe_id}.json"
    bp_path = os.path.join(BLUEPRINTS, bp_name)
    record = {
        "id": body.componentId,
        "componentId": body.componentId,
        "label": body.label,
        "name": body.label,
        "imageAlt": body.label,
        "sourceHtml": body.sourceHtml,
        "description": body.description,
        "sealed": body.sealed,
        "kind": body.kind,
        "blueprint": {
            **body.blueprint,
            "data": {
                **(
                    body.blueprint.get("data", {})
                    if isinstance(body.blueprint.get("data"), dict)
                    else {}
                ),
                "imageAlt": body.label,
            },
        },
        "hasBlueprint": True,
        "blueprintPath": f"public/blueprints/{bp_name}",
        "publishedAt": datetime.now(timezone.utc).isoformat(),
        "isLayout": body.kind == "layout",
    }
    _write_json(bp_path, record)
    entries = _read()
    index = next((i for i, item in enumerate(entries) if item.get("componentId") == body.componentId), -1)
    if index >= 0:
        entries[index] = record
    else:
        entries.append(record)
    _write(entries)
    return {"componentId": body.componentId}


@app.delete("/api/catalog/{component_id}")
def delete_entry(component_id: str) -> dict:
    current = _read()
    removed = next(
        (item for item in current if item.get("componentId") == component_id),
        None,
    )
    entries = [
        item for item in current if item.get("componentId") != component_id
    ]
    _write(entries)
    filename = f"{_safe_id(component_id)}.json"
    if removed and isinstance(removed.get("blueprintPath"), str):
        filename = os.path.basename(removed["blueprintPath"])
    blueprint_path = os.path.abspath(os.path.join(BLUEPRINTS, filename))
    if (
        os.path.commonpath([BLUEPRINTS, blueprint_path]) == BLUEPRINTS
        and os.path.isfile(blueprint_path)
    ):
        os.remove(blueprint_path)
    return {"ok": True}
