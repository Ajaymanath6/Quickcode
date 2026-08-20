import os
from typing import List


def list_catalog_labels(catalog_dir: str) -> List[str]:
    path = os.path.join(catalog_dir, "_catalog.json")
    if not os.path.isfile(path):
        return []
    import json

    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        return []
    labels = []
    for item in data:
        if isinstance(item, dict):
            labels.append(str(item.get("label") or item.get("name") or item.get("id") or ""))
    return [label for label in labels if label]
