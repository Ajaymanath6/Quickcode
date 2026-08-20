from schemas import CanvasPlanRequest, HtmlTitleResponse
from sanitize import sanitize_html
from theme_context.assembler import assemble
from theme_context.session_memory import compress_chat_messages_for_prompt
from vertex_client import generate_content

HTML_SYSTEM = (
    "Return a SINGLE safe HTML fragment. No markdown fences, no <script>, no <html>. "
    "Use brandcolor-* and semantic spacing tokens (gap-micro, p-cozy, p-card-pad-default). "
    "Prefer a single outer inset — do not stack p-* on parent and child. "
    "Tailwind brand contract only."
)


def build_html_prompt(request: CanvasPlanRequest) -> str:
    history = compress_chat_messages_for_prompt(
        [item.model_dump() for item in request.messages]
    )
    theme = assemble(
        prompt=request.prompt,
        theme_snapshot=request.theme_snapshot,
        extended=request.extended_design_context,
    )
    return (
        f"{HTML_SYSTEM}\n{theme}\nHistory:\n{history}\n"
        f"User: {request.prompt}"
    )


def short_title(prompt: str) -> str:
    words = (prompt or "Component").strip().split()
    return " ".join(words[:4]) or "Component"


def create_canvas_html(request: CanvasPlanRequest) -> HtmlTitleResponse:
    raw = generate_content(build_html_prompt(request))
    html = sanitize_html(raw)
    return HtmlTitleResponse(html=html, title=short_title(request.prompt))
