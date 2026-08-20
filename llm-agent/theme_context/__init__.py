from theme_context.assembler import assemble


def assemble_theme_context(snapshot=None, prompt: str = "", extended: bool = False) -> str:
    return assemble(prompt=prompt, theme_snapshot=snapshot, extended=extended)
