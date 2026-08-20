import json
import os
import re
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(REPO_ROOT, "public", "blueprints", "_catalog.json")
BLUEPRINTS_DIR = os.path.join(REPO_ROOT, "public", "blueprints")


class GenerateCodeError(Exception):
    def __init__(self, status: int, detail: str) -> None:
        super().__init__(detail)
        self.status = status
        self.detail = detail


def normalize_name(value: str) -> str:
    return re.sub(r"[\s_]+", "", (value or "").lower())


def load_catalog() -> List[Dict[str, Any]]:
    if not os.path.isfile(CATALOG_PATH):
        return []
    try:
        with open(CATALOG_PATH, encoding="utf-8") as handle:
            parsed = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return []
    if not isinstance(parsed, list):
        return []
    return [item for item in parsed if isinstance(item, dict)]


def published_names(entries: List[Dict[str, Any]]) -> List[str]:
    names: List[str] = []
    for entry in entries:
        label = (
            entry.get("imageAlt")
            or entry.get("label")
            or entry.get("name")
            or entry.get("componentId")
            or entry.get("id")
        )
        if label:
            names.append(str(label))
    return names


def _source_html(entry: Dict[str, Any]) -> str:
    html = entry.get("sourceHtml")
    if isinstance(html, str) and html.strip():
        return html
    blueprint = entry.get("blueprint")
    if isinstance(blueprint, dict):
        nested = blueprint.get("sourceHtml") or blueprint.get("html")
        if isinstance(nested, str):
            return nested
    path = entry.get("blueprintPath")
    if isinstance(path, str) and path:
        full = path if os.path.isabs(path) else os.path.join(REPO_ROOT, path)
        if not os.path.isfile(full):
            full = os.path.join(BLUEPRINTS_DIR, os.path.basename(path))
        if os.path.isfile(full):
            try:
                with open(full, encoding="utf-8") as handle:
                    data = json.load(handle)
                if isinstance(data, dict):
                    return str(
                        data.get("sourceHtml")
                        or data.get("html")
                        or data.get("data", {}).get("sourceHtml")
                        or ""
                    )
            except (OSError, json.JSONDecodeError):
                return ""
    return ""


def _match_keys(entry: Dict[str, Any]) -> List[str]:
    keys = [
        entry.get("id"),
        entry.get("componentId"),
        entry.get("importId"),
        entry.get("component"),
        entry.get("imageAlt"),
        entry.get("label"),
        entry.get("name"),
    ]
    if isinstance(entry.get("blueprint"), dict):
        data = entry["blueprint"]
        keys.extend(
            [
                data.get("imageAlt"),
                data.get("component"),
                data.get("label"),
            ]
        )
        nested = data.get("data")
        if isinstance(nested, dict):
            keys.append(nested.get("imageAlt"))
    return [str(key) for key in keys if key]


def resolve_catalog(
    ref: str, entries: Optional[List[Dict[str, Any]]] = None
) -> Tuple[Optional[Dict[str, Any]], List[str]]:
    catalog = entries if entries is not None else load_catalog()
    needle = normalize_name(ref)
    if not needle:
        return None, catalog
    hits: List[Dict[str, Any]] = []
    for entry in catalog:
        for key in _match_keys(entry):
            if normalize_name(key) == needle:
                hits.append(entry)
                break
    if len(hits) > 1:
        raise GenerateCodeError(
            409,
            "Ambiguous name. Published labels: " + ", ".join(published_names(catalog)),
        )
    if len(hits) == 1:
        return hits[0], catalog
    return None, catalog


def looks_like_name_lookup(prompt: str, blueprint_id: Optional[str]) -> bool:
    if blueprint_id:
        return True
    stripped = prompt.strip()
    return bool(stripped) and " " not in stripped
