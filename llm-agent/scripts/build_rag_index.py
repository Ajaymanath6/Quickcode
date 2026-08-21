#!/usr/bin/env python3
"""Rebuild optional Chroma index from theme-guide + catalog labels."""
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PERSIST = os.path.join(ROOT, ".rag-index")
GUIDE = os.path.join(os.path.dirname(ROOT), "public", "theme-guide.json")


def main() -> int:
    try:
        import chromadb
    except ImportError:
        print("Install RAG extras: pip install -r requirements-rag.txt", file=sys.stderr)
        return 1
    docs = ["Use bg-brandcolor-primary text-brandcolor-white for primary actions."]
    if os.path.isfile(GUIDE):
        with open(GUIDE, encoding="utf-8") as handle:
            data = json.load(handle)
        docs.extend(str(chunk.get("text", "")) for chunk in data.get("chunks", []))
    os.makedirs(PERSIST, exist_ok=True)
    client = chromadb.PersistentClient(path=PERSIST)
    collection = client.get_or_create_collection("quickcode-theme")
    collection.upsert(
        ids=[f"doc-{i}" for i in range(len(docs))],
        documents=docs,
    )
    print(f"Indexed {len(docs)} chunks at {PERSIST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
