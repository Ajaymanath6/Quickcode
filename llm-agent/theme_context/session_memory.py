from typing import Dict, List

MAX_TURNS = 8
MAX_CHARS = 1600


def compress_chat_messages_for_prompt(messages: List[Dict[str, str]]) -> str:
    recent = messages[-MAX_TURNS:]
    lines = [f"{item.get('role', 'user')}: {item.get('content', '')}" for item in recent]
    text = "\n".join(lines)
    if len(text) > MAX_CHARS:
        return text[-MAX_CHARS:]
    return text or "(no prior turns)"
