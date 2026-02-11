import pypdf
import sys

def extract_text_from_pdf(pdf_path, output_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    pdf_path = "c:/Users/muham/OneDrive/Dokumen/JWN Project/NAETA PROJECT/IMBALAN KERJA/APLIKASI/Konsep Pemasukan Aplikasi ke Subdomain.pdf"
    output_path = "c:/Users/muham/OneDrive/Dokumen/JWN Project/NAETA PROJECT/IMBALAN KERJA/APLIKASI/deployment_concept.txt"
    extract_text_from_pdf(pdf_path, output_path)
