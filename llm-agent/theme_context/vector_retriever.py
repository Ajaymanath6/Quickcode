"""Optional Chroma retrieval. Falls back by raising so assembler can use smart/legacy."""

from typing import List

from theme_context.models import ThemeChunk


def retrieve_vectors(prompt: str) -> List[ThemeChunk]:
    persist = os_persist()
    if not persist or not os_exists(persist):
        raise RuntimeError("RAG index missing")
    try:
        import chromadb  # type: ignore
    except ImportError as error:
        raise RuntimeError("chromadb not installed") from error
    client = chromadb.PersistentClient(path=persist)
    collection = client.get_or_create_collection("quickcode-theme")
    results = collection.query(query_texts=[prompt or "theme"], n_results=4)
    docs = (results.get("documents") or [[]])[0]
    chunks: List[ThemeChunk] = []
    for index, doc in enumerate(docs):
        chunks.append(ThemeChunk(id=f"rag-{index}", keywords=[], text=str(doc)))
    if not chunks:
        raise RuntimeError("empty RAG result")
    return chunks


def os_persist() -> str:
    import os

    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    return os.path.join(root, ".rag-index")


def os_exists(path: str) -> bool:
    import os

    return os.path.isdir(path)
