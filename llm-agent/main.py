from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from canvas_html_generate import create_canvas_html
from canvas_html_spacing_pass import apply_spacing_pass
from canvas_plan import create_canvas_plan
from generate_code import (
    GenerateCodeError,
    _source_html,
    looks_like_name_lookup,
    published_names,
    resolve_catalog,
)
from layout_html_generate import create_layout_html
from layout_plan import create_layout_plan
from schemas import (
    CanvasPlanRequest,
    CanvasPlanResponse,
    FreeTextRequest,
    FreeTextResponse,
    GenerateCodeBody,
    HtmlTitleResponse,
    LayoutHtmlRequest,
    LayoutPlanRequest,
    LayoutPlanResponse,
)
from vertex_client import generate_content, vertex_mode
from vertex_credentials import VertexCredentialError

app = FastAPI(title="QuickCode LLM agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "vertex": vertex_mode()}


@app.post("/canvas/plan", response_model=CanvasPlanResponse)
def canvas_plan(body: CanvasPlanRequest) -> CanvasPlanResponse:
    try:
        return create_canvas_plan(body)
    except VertexCredentialError as error:
        raise HTTPException(status_code=503, detail=str(error.detail)) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.post("/canvas/generate-html", response_model=HtmlTitleResponse)
def canvas_generate_html(body: CanvasPlanRequest) -> HtmlTitleResponse:
    try:
        result = create_canvas_html(body)
        html = apply_spacing_pass(result.html, body)
        return HtmlTitleResponse(html=html, title=result.title)
    except VertexCredentialError as error:
        raise HTTPException(status_code=503, detail=str(error.detail)) from error


@app.post("/layout/plan", response_model=LayoutPlanResponse)
def layout_plan(body: LayoutPlanRequest) -> LayoutPlanResponse:
    try:
        return create_layout_plan(body)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.post("/layout/generate-html", response_model=HtmlTitleResponse)
def layout_generate_html(body: LayoutHtmlRequest) -> HtmlTitleResponse:
    return create_layout_html(body)


@app.post("/layout/generate", response_model=FreeTextResponse)
@app.post("/generate", response_model=FreeTextResponse)
def free_text(body: FreeTextRequest) -> FreeTextResponse:
    prompt = body.text or body.prompt
    if not prompt.strip():
        raise HTTPException(status_code=422, detail="Empty prompt")
    return FreeTextResponse(text=generate_content(prompt))


@app.post("/generate-code")
def generate_code(body: GenerateCodeBody) -> dict:
    prompt = (body.prompt or "").strip()
    blueprint_id = (body.blueprintId or "").strip() or None
    if not prompt and not blueprint_id:
        raise HTTPException(status_code=422, detail="Empty prompt")
    lookup = blueprint_id or prompt
    try:
        hit, catalog = resolve_catalog(lookup)
    except GenerateCodeError as error:
        raise HTTPException(status_code=error.status, detail=error.detail) from error
    if hit:
        html = _source_html(hit)
        if html:
            return {"code": html}
    if looks_like_name_lookup(prompt or lookup, blueprint_id):
        names = published_names(catalog)
        listing = ", ".join(names) if names else "(none published yet)"
        raise HTTPException(
            status_code=404,
            detail=f'No published component matching "{lookup}". Names: {listing}',
        )
    generated = create_canvas_html(CanvasPlanRequest(prompt=prompt or lookup))
    return {"code": generated.html}
