import re

def extract_chapters_with_keyword(text, keyword="手順"):

    # 「第〇章」で始まる章を抽出する正規表現パターン
    # DOTALLオプションで改行も含む全体を対象にします。
    pattern = re.compile(r'(第\d+章.*?)(?=第\d+章|$)', re.DOTALL)
    chapters = pattern.findall(text)
    
     # 各章の最初の行（ヘッダー部分）にキーワードが含まれているかをチェック
    chapters_with_keyword = []
    for chapter in chapters:
        header_line = chapter.splitlines()[0]  # 章のヘッダー行
        if keyword in header_line:
            chapters_with_keyword.append(chapter.strip())
    
    return chapters_with_keyword

if __name__ == '__main__':
    sample_file_path = "sample_manual.txt"

    with open(sample_file_path, "r", encoding="utf-8") as file:
        sample_text = file.read()

        # 実験プロトコルを抽出
    extracted_chapters = extract_chapters_with_keyword(sample_text, keyword="手順")
    
    print("抽出された章:")
    for chapter in extracted_chapters:
        print("-----")
        print(chapter)
