from typing import Any, Dict, List, Union

from pydantic import ValidationError

from schemas import (
    CatalogBlock,
    ChromeBlock,
    LayoutPlanRequest,
    LayoutPlanResponse,
    LayoutPlanV1,
    RowBlock,
    SplitBlock,
)
from theme_context.assembler import assemble
from vertex_client import extract_json_object, generate_content

LAYOUT_SYSTEM = (
    "Return STRICT JSON only {\"version\":1,\"blocks\":[...]} with types chrome, catalog, row, split. "
    "catalog.ref must be from the allowlist. row has 2–4 chrome/catalog columns. "
    "split variant sidebarMain with sidebar/main leaf lists, sidebarPlacement start|end, "
    "sidebarWidth narrow|default|wide. Optional afterGap tight|default|section|hero. "
    "Do not invent catalog ids."
)


def _norm(value: str) -> str:
    return "".join(ch for ch in value.lower() if ch not in " _-")


def filter_allowlist(plan: LayoutPlanV1, allowlist: List[str]) -> LayoutPlanV1:
    allowed = {_norm(item) for item in allowlist}

    def ok_leaf(block: Union[ChromeBlock, CatalogBlock]) -> bool:
        if isinstance(block, CatalogBlock):
            return not allowed or _norm(block.ref) in allowed
        return True

    cleaned: List[Any] = []
    for block in plan.blocks:
        if isinstance(block, CatalogBlock) and not ok_leaf(block):
            continue
        if isinstance(block, RowBlock):
            cols = [col for col in block.columns if ok_leaf(col)]
            if 2 <= len(cols) <= 4:
                cleaned.append(block.model_copy(update={"columns": cols}))
            else:
                cleaned.extend(cols)
            continue
        if isinstance(block, SplitBlock):
            sidebar = [item for item in block.sidebar if ok_leaf(item)]
            main = [item for item in block.main if ok_leaf(item)]
            cleaned.append(block.model_copy(update={"sidebar": sidebar, "main": main}))
            continue
        cleaned.append(block)
    return LayoutPlanV1(version=1, blocks=cleaned)


def create_layout_plan(request: LayoutPlanRequest) -> LayoutPlanResponse:
    allow = ", ".join(request.catalogAllowlist) or "(empty — chrome only)"
    theme = assemble(
        prompt=request.prompt,
        theme_snapshot=request.theme_snapshot,
        extended=request.extended_design_context,
    )
    prompt = (
        f"{LAYOUT_SYSTEM}\nAllowlist: {allow}\n{theme}\nUser: {request.prompt}"
    )
    raw = generate_content(prompt)
    payload = extract_json_object(raw)
    if not payload:
        raise ValueError("layout plan JSON not found")
    if "blocks" not in payload:
        payload = {"version": 1, "blocks": payload.get("plan", {}).get("blocks", [])}
    try:
        plan = LayoutPlanV1.model_validate(payload)
    except ValidationError as error:
        raise ValueError(f"invalid layout plan: {error}") from error
    return LayoutPlanResponse(plan=filter_allowlist(plan, request.catalogAllowlist))
