import os
from dotenv import load_dotenv
# ここでは AzureOpenAI クライアントが利用できると仮定しています。
# 例えば、適切なライブラリが提供されている場合：
from openai import AzureOpenAI  # ※ 実際のモジュール名に合わせて変更してください

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数から各種パラメータを取得
API_KEY = os.getenv("AZURE_API_KEY")
ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
API_VERSION = os.getenv("AZURE_API_VERSION", "2024-12-01-preview")
DEPLOYMENT_ID = os.getenv("AZURE_DEPLOYMENT_ID", "gpt-4o")

def generate_advice(chapter_text):
    """
    指定された実験プロトコルの章に対し、Azure OpenAI を利用して追加アドバイスを生成する関数。
    """
    # アドバイス生成用のプロンプトを構築
    prompt = f"""あなたは実験プロトコルの専門家です。以下の実験手順テキストを、各ステップごとに細かく分割してください。そして、各ステップに対して、以下の内容を追加してください。

- **明文化されていない実験手技** 手順の背景や、実験成功のための補足情報

出力は、各ステップを以下の形式で記述してください。

【ステップ番号・タイトル】  
（元の手順テキスト）
 (手技の説明、コツ)

それでは、以下の入力テキストに基づいて、詳細な実験指示を作成してください。

---
{chapter_text}
"""
    # AzureOpenAI クライアントの初期化
    client = AzureOpenAI(
        api_key=API_KEY,
        api_version=API_VERSION,
        azure_endpoint=ENDPOINT
    )
    
    # チャット補完 API の呼び出し
    response = client.chat.completions.create(
        model=DEPLOYMENT_ID,
        messages=[
            {"role": "system", "content": "あなたは実験プロトコルの専門家です。以下の実験手順テキストを、各ステップごとに細かく分割してください。そして、各ステップに対して、以下の内容を追加してください。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    return response.choices[0].message.content

if __name__ == '__main__':
    # サンプルの章の内容
    sample_chapter = (
        "第3章. 手順/n
        3.1. 細胞の回収
        細胞懸濁液を遠心チューブに移す。
        1,500 × gで5分間遠心分離を行い、ペレットを形成させる。
        上清をピペットで除去する。
        3.2. PBSによる洗浄
        1 mL（または適量）のPBSを加え、ピペッティングしてペレットを優しく再懸濁する。
        再び1,500 × gで5分間遠心し、上清を慎重に除去する。
        この洗浄ステップを2回繰り返す。
        3.3. ペレットの水切りと懸濁
        最後の遠心後、上清を完全に除去する。
        必要に応じてチューブを軽く振るか、逆さにして余分な液を除去する。
        新たな溶液（培地、緩衝液など）を加え、ペレットを丁寧にピペッティングして再懸濁する。" 
          
    )
    advice = generate_advice(sample_chapter)
    print("【追加アドバイス】")
    print(advice)
