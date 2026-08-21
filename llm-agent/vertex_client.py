import json
import os
import re
from typing import Optional, Protocol

from vertex_credentials import VertexCredentialError, load_vertex_client, vertex_mock_enabled

VERTEX_MODE_LIVE = "live"
VERTEX_MODE_MOCK = "mock"


class GenerateContent(Protocol):
    def __call__(self, prompt: str) -> str: ...


def vertex_mode() -> str:
    if vertex_mock_enabled() or not os.environ.get("GCP_PROJECT"):
        return VERTEX_MODE_MOCK
    return VERTEX_MODE_LIVE


def mock_generate_content(prompt: str) -> str:
    lower = prompt.lower()
    if "html fragment" in lower or "single safe html" in lower or "spacing auditor" in lower:
        if "auditor" in lower or '"html"' in lower:
            return json.dumps(
                {
                    "html": (
                        '<section class="p-card-pad-default rounded-lg border border-brandcolor-strokeweak bg-brandcolor-white">'
                        '<h2 class="text-lg font-semibold text-brandcolor-textstrong">Panel</h2>'
                        "</section>"
                    )
                }
            )
        return (
            '<section class="p-card-pad-default rounded-lg border border-brandcolor-strokeweak bg-brandcolor-white">'
            '<p class="text-xs uppercase tracking-wide text-brandcolor-textweak">HTML creator</p>'
            '<h2 class="mt-1 text-lg font-semibold text-brandcolor-textstrong">Generated block</h2>'
            '<p class="mt-2 text-sm text-brandcolor-textweak">Mock fragment using brandcolor tokens.</p>'
            '<button type="button" class="mt-4 rounded-md bg-brandcolor-primary px-3 py-1.5 text-sm text-brandcolor-white hover:bg-brandcolor-primaryhover">Action</button>'
            "</section>"
        )
    if "json" in lower and "nodes" in lower:
        if "primary button" in lower or "submit" in lower:
            return json.dumps(
                {
                    "version": 1,
                    "nodes": [{"kind": "primaryButton", "label": "Submit"}],
                }
            )
        if "sidebar" in lower:
            return json.dumps(
                {
                    "version": 2,
                    "nodes": [
                        {
                            "kind": "productSidebar",
                            "title": "Workspace",
                            "trailingIconKey": "chevronUpDown",
                            "searchPlaceholder": "Search",
                            "neutralButtonLabel": "New",
                            "sections": [
                                {
                                    "heading": "Main",
                                    "items": [{"label": "Home", "iconKey": "home"}],
                                }
                            ],
                        }
                    ],
                }
            )
        return json.dumps(
            {
                "version": 1,
                "nodes": [
                    {
                        "kind": "card",
                        "title": "Status card",
                        "subtitle": "Plan",
                        "body": "Generated from the mock LLM client.",
                    },
                    {"kind": "primaryButton", "label": "Continue"},
                ],
            }
        )
    if "allowlist" in lower or ("blocks" in lower and "chrome" in lower):
        return json.dumps(
            {
                "version": 1,
                "blocks": [
                    {"type": "chrome", "hint": "header"},
                    {"type": "row", "columns": [{"type": "chrome", "hint": "a"}, {"type": "chrome", "hint": "b"}]},
                ],
            }
        )
    if '"html"' in lower or "auditor" in lower:
        return json.dumps(
            {
                "html": (
                    '<section class="p-card-pad-default rounded-lg border border-brandcolor-strokeweak bg-brandcolor-white">'
                    '<h2 class="text-lg font-semibold text-brandcolor-textstrong">Panel</h2>'
                    "</section>"
                )
            }
        )
    return (
        '<section class="p-card-pad-default rounded-lg border border-brandcolor-strokeweak bg-brandcolor-white">'
        '<p class="text-xs uppercase tracking-wide text-brandcolor-textweak">HTML creator</p>'
        '<h2 class="mt-1 text-lg font-semibold text-brandcolor-textstrong">Generated block</h2>'
        '<p class="mt-2 text-sm text-brandcolor-textweak">Mock fragment using brandcolor tokens.</p>'
        '<button type="button" class="mt-4 rounded-md bg-brandcolor-primary px-3 py-1.5 text-sm text-brandcolor-white hover:bg-brandcolor-primaryhover">Action</button>'
        "</section>"
    )


def live_generate_content(prompt: str) -> str:
    client = load_vertex_client()
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()
    response = client.models.generate_content(model=model, contents=prompt)
    text = getattr(response, "text", None)
    return str(text if text else response)


def generate_content(prompt: str) -> str:
    if vertex_mode() == VERTEX_MODE_LIVE:
        try:
            return live_generate_content(prompt)
        except VertexCredentialError:
            raise
        except Exception:
            return mock_generate_content(prompt)
    return mock_generate_content(prompt)


def extract_json_object(text: str) -> Optional[dict]:
    stripped = text.strip()
    if stripped.startswith("```"):
        lines = stripped.split("\n")
        stripped = "\n".join(lines[1:])
        if stripped.rstrip().endswith("```"):
            stripped = stripped.rstrip()[:-3]
    match = re.search(r"\{[\s\S]*\}", stripped)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None
