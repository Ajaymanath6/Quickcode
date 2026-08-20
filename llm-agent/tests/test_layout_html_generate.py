from layout_html_generate import create_layout_html
from layout_plan import filter_allowlist
from schemas import CatalogBlock, ChromeBlock, LayoutHtmlRequest, LayoutPlanV1, RowBlock, SplitBlock


def test_row_flattened_when_too_few_columns_after_filter() -> None:
    plan = LayoutPlanV1(
        version=1,
        blocks=[
            RowBlock(
                type="row",
                columns=[
                    CatalogBlock(type="catalog", ref="allowed"),
                    CatalogBlock(type="catalog", ref="nope"),
                ],
            )
        ],
    )
    cleaned = filter_allowlist(plan, ["allowed"])
    assert all(not isinstance(block, RowBlock) for block in cleaned.blocks)


def test_split_and_catalog_allowlist() -> None:
    plan = LayoutPlanV1(
        version=1,
        blocks=[
            SplitBlock(
                type="split",
                sidebar=[CatalogBlock(type="catalog", ref="nav")],
                main=[ChromeBlock(type="chrome", hint="main")],
            )
        ],
    )
    cleaned = filter_allowlist(plan, ["nav"])
    split = cleaned.blocks[0]
    assert isinstance(split, SplitBlock)
    assert split.sidebar[0].ref == "nav"


def test_layout_html_returns_title() -> None:
    result = create_layout_html(
        LayoutHtmlRequest(prompt="page shell", catalogAllowlist=["nav"])
    )
    assert result.title
    assert "<" in result.html
