from canvas_html_generate import short_title
from canvas_html_spacing_pass import apply_spacing_pass
from schemas import CanvasPlanRequest, HtmlTitleResponse, LayoutHtmlRequest
from sanitize import sanitize_html
from theme_context.assembler import assemble
from vertex_client import generate_content


def create_layout_html(request: LayoutHtmlRequest) -> HtmlTitleResponse:
    refs = "\n".join(
        f"- {block.id} ({block.label}): {block.htmlSnippet[:400]}"
        for block in request.catalogReferenceBlocks
    )
    theme = assemble(
        prompt=request.prompt,
        theme_snapshot=request.theme_snapshot,
        extended=request.extended_design_context,
    )
    prompt = (
        "Return a layout HTML fragment using allowlisted snippets as islands. "
        "No scripts or markdown. Single outer inset.\n"
        f"{theme}\nAllowlist: {', '.join(request.catalogAllowlist)}\n"
        f"References:\n{refs}\nUser: {request.prompt}"
    )
    html = sanitize_html(generate_content(prompt))
    spacing_req = CanvasPlanRequest(
        prompt=request.prompt,
        spacing_enforcement=request.spacing_enforcement,
        theme_snapshot=request.theme_snapshot,
        extended_design_context=request.extended_design_context,
    )
    html = apply_spacing_pass(html, spacing_req)
    return HtmlTitleResponse(html=html, title=short_title(request.prompt or "Layout"))
