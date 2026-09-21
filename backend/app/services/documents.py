from io import BytesIO
from html import escape

from docx import Document
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet


def generate_docx(
    meeting_id: int,
    title: str,
    minutes: str,
) -> bytes:
    """
    Generate a DOCX document in memory and return it as bytes.
    """

    document = Document()

    document.add_heading(title, level=1)
    document.add_heading("Meeting Minutes", level=2)

    for paragraph in minutes.split("\n\n"):
        document.add_paragraph(paragraph)

    output = BytesIO()
    document.save(output)

    return output.getvalue()


def generate_pdf(
    meeting_id: int,
    title: str,
    minutes: str,
) -> bytes:
    """
    Generate a PDF document in memory and return it as bytes.
    """

    output = BytesIO()

    document = SimpleDocTemplate(
        output,
        pagesize=A4,
    )

    styles = getSampleStyleSheet()

    story = [
        Paragraph(
            escape(title), 
            styles["Title"],
        ),
        Spacer(1, 20),
    ]

    for paragraph in minutes.split("\n\n"):
        safe_paragraph = escape(paragraph).replace(
            "\n",
            "<br/>",
        )

        story.append(
            Paragraph(
                safe_paragraph,
                styles["BodyText"],
            )
        )

        story.append(
            Spacer(1, 10)
        )

    document.build(story)

    return output.getvalue() 