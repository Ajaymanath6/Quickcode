from typing import Any, Dict, Optional

DEFAULT_PALETTE = {
    "50": "#f4f6f8",
    "100": "#e8ecf1",
    "200": "#d0d8e2",
    "500": "#3d4f63",
    "700": "#243140",
    "900": "#121820",
    "warning": "#c47b16",
    "warning-soft": "#f8edd9",
}


def live_palette(theme_snapshot: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    colors = dict(DEFAULT_PALETTE)
    if not theme_snapshot:
        return colors
    nested = theme_snapshot.get("colors") if isinstance(theme_snapshot, dict) else None
    source = nested if isinstance(nested, dict) else theme_snapshot
    for key, value in source.items():
        colors[str(key)] = str(value)
    return colors
