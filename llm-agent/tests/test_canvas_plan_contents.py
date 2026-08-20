import pytest
from pydantic import ValidationError

from canvas_plan import parse_canvas_plan
from schemas import CardNode, ProductSidebarNode


def test_parse_rejects_fences_without_json() -> None:
    with pytest.raises(ValueError):
        parse_canvas_plan("```json\nnot a plan\n```")


def test_parse_version_and_nodes() -> None:
    plan = parse_canvas_plan(
        '{"version":1,"nodes":[{"kind":"primaryButton","label":"Submit"}]}'
    )
    assert plan.version == 1
    assert plan.nodes[0].kind == "primaryButton"
    assert plan.nodes[0].label == "Submit"


def test_card_title_is_short() -> None:
    node = CardNode(
        kind="card",
        title="Please build an entire onboarding wizard with extra words",
        body="The long brief belongs here.",
    )
    assert len(node.title.split()) <= 4


def test_product_sidebar_repairs_enums() -> None:
    node = ProductSidebarNode.model_validate(
        {
            "kind": "productSidebar",
            "title": "Nav",
            "trailingIconKey": "not-real",
            "sections": [{"heading": "Main", "items": [{"label": "Home", "iconKey": "weird"}]}],
        }
    )
    assert node.trailingIconKey == "none"
    assert node.sections[0].items[0].iconKey == "none"
