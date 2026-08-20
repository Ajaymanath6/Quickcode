from schemas import CANVAS_HTML_SPACING_PASS_MAX_CHARS, CanvasPlanRequest
from sanitize import sanitize_html
from vertex_client import extract_json_object, generate_content

AUDITOR = (
    "You are a spacing auditor. Return JSON only {\"html\":\"...\"} with the same markup "
    "but semantic spacing tokens (p-cozy, p-card-pad-default, gap-micro). "
    "Keep a single outer inset. No markdown."
)


def apply_spacing_pass(html: str, request: CanvasPlanRequest) -> str:
    if not request.spacing_enforcement:
        return html
    if len(html) > CANVAS_HTML_SPACING_PASS_MAX_CHARS:
        return html
    raw = generate_content(f"{AUDITOR}\n{html}")
    parsed = extract_json_object(raw)
    if not parsed or not isinstance(parsed.get("html"), str):
        return html
    next_html = sanitize_html(parsed["html"])
    return next_html or html
