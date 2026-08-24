from typing import Any, Dict, Optional

DEFAULT_PALETTE = {
    "primary": "#F5C251",
    "primaryhover": "#F3B42A",
    "secondary": "#1198ED",
    "secondaryfill": "#E8F5FC",
    "secondaryhover": "#0E81C9",
    "neutralhover": "#EFEFEF",
    "textstrong": "#333333",
    "textweak": "#696969",
    "strokestrong": "#696969",
    "strokeweak": "#E8E8E8",
    "strokemild": "#858585",
    "strokelight": "#F6F6F6",
    "fill": "#FAFAFA",
    "white": "#FFFFFF",
    "sidebarhover": "#2E3C48",
    "divider": "#E8E8E8",
    "banner-info-bg": "#FFE4D6",
    "banner-warning-bg": "#FFEBE1",
    "banner-warning-button": "#F5C251",
    "results-bg": "#F8F9FB",
    "archived-bg": "#FBF8E7",
    "archived-border": "#A5A5A5",
    "archived-badge": "#E8E8E8",
    "destructive": "#C20205",
    "table-header": "#DDDDDD",
    "badge-success-bg": "#E2F3E0",
    "badge-success-text": "#028831",
    "badge-attorney-bg": "#F2EBFF",
    "badge-attorney-text": "#6238AA",
    "badge-amber-bg": "#FFF7DB",
    "badge-amber-text": "#A47800",
}

# Accept legacy scale keys from older clients and map into semantic tokens.
_LEGACY_KEY_MAP = {
    "50": "fill",
    "100": "strokelight",
    "200": "strokeweak",
    "500": "textweak",
    "700": "primary",
    "900": "textstrong",
    "warning": "banner-warning-button",
    "warning-soft": "banner-warning-bg",
}


def live_palette(theme_snapshot: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    colors = dict(DEFAULT_PALETTE)
    if not theme_snapshot:
        return colors
    nested = theme_snapshot.get("colors") if isinstance(theme_snapshot, dict) else None
    source = nested if isinstance(nested, dict) else theme_snapshot
    for key, value in source.items():
        raw = str(key)
        if raw.startswith("brandcolor"):
            raw = raw.replace("brandcolor", "", 1).lstrip("-_")
        mapped = _LEGACY_KEY_MAP.get(raw, raw)
        colors[mapped] = str(value)
    return colors
