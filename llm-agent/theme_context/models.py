from typing import List

from pydantic import BaseModel


class ThemeChunk(BaseModel):
    id: str
    keywords: List[str]
    text: str
