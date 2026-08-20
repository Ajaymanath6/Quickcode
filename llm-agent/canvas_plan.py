from typing import Any, Dict, List

from pydantic import ValidationError

from schemas import CanvasPlanRequest, CanvasPlanResponse, CanvasPlanV1
from theme_context.assembler import assemble
from theme_context.session_memory import compress_chat_messages_for_prompt
from vertex_client import extract_json_object, generate_content

SHORT_LABEL_RULE = (
    "CRITICAL: card.title is a SHORT catalog name (1–4 words), NEVER the full user prompt. "
    "Long copy belongs in body. Button label is SHORT button text only."
)

CANVAS_PLAN_SYSTEM = (
    "Return STRICT JSON only, no markdown fences: "
    '{"version":1,"nodes":[{"kind":"card|primaryButton|secondaryButton|neutralButton|'
    'confirmPasswordInput|textInputField|productSidebar|htmlSnippet",...}]}. '
    "No id fields. Prefer 1–6 nodes (max 12). "
    f"{SHORT_LABEL_RULE} "
    "productSidebar trailingIconKey: chevronUpDown|chevronUp|chevronDown|none. "
    "item iconKey: home|folder|task|fileText|key|history|none. "
    "Plan ONLY for the latest user prompt; history is context."
)


def build_canvas_plan_prompt(request: CanvasPlanRequest) -> str:
    history = compress_chat_messages_for_prompt(
        [item.model_dump() for item in request.messages]
    )
    theme = assemble(
        prompt=request.prompt,
        theme_snapshot=request.theme_snapshot,
        extended=request.extended_design_context,
    )
    return (
        f"{CANVAS_PLAN_SYSTEM}\n{theme}\nHistory:\n{history}\n"
        f"Latest prompt: {request.prompt}"
    )


def parse_canvas_plan(text: str) -> CanvasPlanV1:
    if "```" in text.strip()[:20]:
        payload = extract_json_object(text)
    else:
        payload = extract_json_object(text)
    if not payload:
        raise ValueError("plan JSON not found")
    if "nodes" in payload and "version" not in payload:
        payload = {"version": 1, "nodes": payload["nodes"]}
    return CanvasPlanV1.model_validate(payload)


def create_canvas_plan(request: CanvasPlanRequest) -> CanvasPlanResponse:
    raw = generate_content(build_canvas_plan_prompt(request))
    try:
        plan = parse_canvas_plan(raw)
    except (ValueError, ValidationError) as error:
        raise ValueError(f"invalid canvas plan: {error}") from error
    return CanvasPlanResponse(plan=plan)
