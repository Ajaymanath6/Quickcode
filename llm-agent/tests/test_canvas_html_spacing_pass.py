from canvas_html_spacing_pass import apply_spacing_pass
from schemas import CanvasPlanRequest


def test_invalid_json_keeps_first_html(monkeypatch) -> None:
    first = "<section class='p-4'>keep</section>"

    def fake_generate(_prompt: str) -> str:
        return "```\nnot-json\n```"

    monkeypatch.setattr("canvas_html_spacing_pass.generate_content", fake_generate)
    result = apply_spacing_pass(
        first,
        CanvasPlanRequest(prompt="tighten spacing", spacing_enforcement=True),
    )
    assert result == first


def test_skip_when_disabled() -> None:
    html = "<div>a</div>"
    assert (
        apply_spacing_pass(html, CanvasPlanRequest(prompt="x", spacing_enforcement=False))
        == html
    )
