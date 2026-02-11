from pypdf import PdfReader

reader = PdfReader("SUMBER MATERI APLIKASI IMBALAN KERJA.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open("pdf_content.txt", "w", encoding="utf-8") as f:
    f.write(text)
