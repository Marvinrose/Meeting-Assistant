def generate_minutes(title: str, transcript: str) -> str:
    if not transcript.strip():
        return "No transcript available."

    paragraphs = [
        paragraph.strip()
        for paragraph in transcript.split("\n")
        if paragraph.strip()
    ]

    summary = "\n\n".join(paragraphs[:10])

    return f"""MEETING MINUTES

Meeting Title
{title}

Summary
{summary}

Transcript
{transcript}
"""