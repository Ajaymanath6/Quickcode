from canvas_html_generate import create_canvas_html, short_title
from schemas import CanvasPlanRequest
from sanitize import sanitize_html


def test_fragment_has_no_fences_or_scripts() -> None:
    result = create_canvas_html(CanvasPlanRequest(prompt="primary button labeled Submit"))
    assert "```" not in result.html
    assert "<script" not in result.html.lower()
    assert result.html.startswith("<")
    assert result.title


def test_sanitize_strips_script() -> None:
    html = sanitize_html('```html\n<div>Hi<script>x()</script></div>\n```')
    assert "<script>" not in html
    assert "Hi" in html


def test_short_title_caps_words() -> None:
    assert len(short_title("one two three four five six").split()) <= 4
