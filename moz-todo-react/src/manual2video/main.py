from text import extract_chapters_with_keyword

def main():
    sample_file_path = "sample_manual.txt"

    with open(sample_file_path, "r", encoding="utf-8") as file:
        sample_text = file.read()

        # 実験プロトコルを抽出
    extracted_chapters = extract_chapters_with_keyword(sample_text, keyword="手順")
    
    print("抽出された章:")
    for chapter in extracted_chapters:
        print("-----")
        print(chapter)

if __name__ == '__main__':
    main()

 
 
