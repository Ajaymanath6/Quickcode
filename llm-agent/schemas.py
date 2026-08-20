from typing import Annotated, Any, Dict, List, Literal, Optional, Union

from pydantic import AliasChoices, BaseModel, Field, field_validator, model_validator

IconKey = Literal["home", "folder", "task", "fileText", "key", "history", "none"]
TrailingIconKey = Literal["chevronUpDown", "chevronUp", "chevronDown", "none"]
GapToken = Literal["tight", "default", "section", "hero"]
ICON_KEYS = {"home", "folder", "task", "fileText", "key", "history", "none"}
TRAILING_KEYS = {"chevronUpDown", "chevronUp", "chevronDown", "none"}

CANVAS_HTML_MAX_CHARS = 24000
CANVAS_HTML_SPACING_PASS_MAX_CHARS = 8000


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class CanvasPlanRequest(BaseModel):
    prompt: str = ""
    messages: List[ChatMessage] = Field(
        default_factory=list,
        validation_alias=AliasChoices("messages", "history"),
    )
    extended_design_context: bool = Field(
        default=False,
        validation_alias=AliasChoices("extended_design_context", "extendedDesignContext"),
    )
    theme_snapshot: Optional[Dict[str, Any]] = Field(
        default=None,
        validation_alias=AliasChoices("theme_snapshot", "themeSnapshot"),
    )
    canvas_references: List[Dict[str, Any]] = Field(
        default_factory=list,
        validation_alias=AliasChoices("canvas_references", "canvasReferences", "mentionedIds"),
    )
    spacing_enforcement: bool = Field(
        default=False,
        validation_alias=AliasChoices("spacing_enforcement", "spacingEnforcement"),
    )


class CardNode(BaseModel):
    kind: Literal["card"] = "card"
    title: str
    subtitle: str = ""
    body: str = ""
    x: Optional[float] = None
    y: Optional[float] = None

    @field_validator("title")
    @classmethod
    def short_title(cls, value: str) -> str:
        words = value.strip().split()
        if len(words) > 4:
            return " ".join(words[:4])
        return value.strip() or "Card"


class ButtonNode(BaseModel):
    kind: Literal["primaryButton", "secondaryButton", "neutralButton"]
    label: str
    x: Optional[float] = None
    y: Optional[float] = None

    @field_validator("label")
    @classmethod
    def short_label(cls, value: str) -> str:
        words = value.strip().split()
        if len(words) > 4:
            return " ".join(words[:4])
        return value.strip() or "Button"


class InputNode(BaseModel):
    kind: Literal["confirmPasswordInput", "textInputField"]
    label: str
    x: Optional[float] = None
    y: Optional[float] = None


class SidebarItem(BaseModel):
    label: str
    iconKey: IconKey = "none"

    @field_validator("iconKey", mode="before")
    @classmethod
    def repair_icon(cls, value: Any) -> str:
        text = str(value or "none")
        return text if text in ICON_KEYS else "none"


class SidebarSection(BaseModel):
    heading: str = "Main"
    items: List[SidebarItem] = Field(default_factory=list)


class ProductSidebarNode(BaseModel):
    kind: Literal["productSidebar"] = "productSidebar"
    title: str = "Menu"
    trailingIconKey: TrailingIconKey = "none"
    searchPlaceholder: str = "Search"
    neutralButtonLabel: str = "New"
    sections: List[SidebarSection] = Field(default_factory=list)
    x: Optional[float] = None
    y: Optional[float] = None

    @field_validator("trailingIconKey", mode="before")
    @classmethod
    def repair_trailing(cls, value: Any) -> str:
        text = str(value or "none")
        return text if text in TRAILING_KEYS else "none"


class HtmlSnippetPlanNode(BaseModel):
    kind: Literal["htmlSnippet"] = "htmlSnippet"
    label: str = "Frame"
    html: str = ""
    x: Optional[float] = None
    y: Optional[float] = None


CanvasNode = Annotated[
    Union[CardNode, ButtonNode, InputNode, ProductSidebarNode, HtmlSnippetPlanNode],
    Field(discriminator="kind"),
]


class CanvasPlanV1(BaseModel):
    version: Literal[1, 2] = 1
    nodes: List[CanvasNode]

    @field_validator("nodes")
    @classmethod
    def cap_nodes(cls, nodes: List[CanvasNode]) -> List[CanvasNode]:
        if not nodes:
            raise ValueError("nodes required")
        return nodes[:12]


class CanvasPlanResponse(BaseModel):
    plan: CanvasPlanV1


class HtmlTitleResponse(BaseModel):
    html: str
    title: str


class ChromeBlock(BaseModel):
    type: Literal["chrome"] = "chrome"
    hint: str = ""
    afterGap: Optional[GapToken] = None
    defaultAfterGap: Optional[GapToken] = None


class CatalogBlock(BaseModel):
    type: Literal["catalog"] = "catalog"
    ref: str
    afterGap: Optional[GapToken] = None


class RowBlock(BaseModel):
    type: Literal["row"] = "row"
    columns: List[Union[ChromeBlock, CatalogBlock]]
    afterGap: Optional[GapToken] = None

    @field_validator("columns")
    @classmethod
    def two_to_four(cls, columns: List[Any]) -> List[Any]:
        if len(columns) < 2 or len(columns) > 4:
            raise ValueError("row needs 2–4 columns")
        return columns


class SplitBlock(BaseModel):
    type: Literal["split"] = "split"
    variant: Literal["sidebarMain"] = "sidebarMain"
    sidebar: List[Union[ChromeBlock, CatalogBlock]]
    main: List[Union[ChromeBlock, CatalogBlock]]
    sidebarPlacement: Literal["start", "end"] = "start"
    sidebarWidth: Literal["narrow", "default", "wide"] = "default"
    afterGap: Optional[GapToken] = None


LayoutBlock = Union[ChromeBlock, CatalogBlock, RowBlock, SplitBlock]


class LayoutPlanV1(BaseModel):
    version: Literal[1] = 1
    blocks: List[LayoutBlock] = Field(default_factory=list)


class LayoutPlanRequest(BaseModel):
    prompt: str = ""
    catalogAllowlist: List[str] = Field(default_factory=list)
    extended_design_context: bool = Field(
        default=False,
        validation_alias=AliasChoices("extended_design_context", "extendedDesignContext"),
    )
    theme_snapshot: Optional[Dict[str, Any]] = Field(
        default=None,
        validation_alias=AliasChoices("theme_snapshot", "themeSnapshot"),
    )


class CatalogReferenceBlock(BaseModel):
    id: str
    label: str = ""
    htmlSnippet: str = ""


class LayoutHtmlRequest(LayoutPlanRequest):
    catalogReferenceBlocks: List[CatalogReferenceBlock] = Field(default_factory=list)
    spacing_enforcement: bool = Field(
        default=False,
        validation_alias=AliasChoices("spacing_enforcement", "spacingEnforcement"),
    )


class LayoutPlanResponse(BaseModel):
    plan: LayoutPlanV1


class FreeTextRequest(BaseModel):
    text: str = ""
    prompt: str = ""

    @model_validator(mode="after")
    def coalesce(self) -> "FreeTextRequest":
        if not self.text and self.prompt:
            self.text = self.prompt
        return self


class FreeTextResponse(BaseModel):
    text: str


class GenerateCodeBody(BaseModel):
    prompt: str = ""
    blueprintId: Optional[str] = None
