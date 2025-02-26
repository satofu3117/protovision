from text import extract_chapters_with_keyword
from rag import generate_advice
from luma_ai import process_steps

def main():
    sample_file_path = "sample_manual.txt"

    with open(sample_file_path, "r", encoding="utf-8") as file:
        sample_text = file.read()

        # 実験プロトコルを抽出
    extracted_chapters = extract_chapters_with_keyword(sample_text, keyword="手順")
    
    chapeter_rag=generate_advice(extracted_chapters)
    
    process_steps(chapeter_rag)


if __name__ == '__main__':
    main()

 
 
