import os
import time
from lumaai import LumaAI
import requests

# LumaAIクライアントのセットアップ
client = LumaAI(auth_token=os.environ.get("LUMAAI_API_KEY"))

def generate_video(prompt, step_number):
    """ 指定したプロンプトに基づいて動画を生成し、ダウンロードする """
    generation = client.generations.create(
        prompt=prompt,
        keyframes={"frame0": {"type": "text", "text": prompt}}
    )

    # 動画の生成を監視
    while generation.state not in ["completed", "failed"]:
        time.sleep(5)  # 少し待機して再取得
        generation = client.generations.get(generation.id)

    if generation.state == "completed":
        video_url = generation.assets.video
        response = requests.get(video_url)

        filename = f"step_{step_number}.mp4"
        with open(filename, "wb") as file:
            file.write(response.content)
        print(f"動画 {filename} を保存しました。")
    else:
        print(f"ステップ {step_number} の動画生成に失敗しました。")

def process_steps(input_file):
    """ 指定したファイルから手順を読み取り、各ステップの動画を生成 """
    with open(input_file, "r", encoding="utf-8") as file:
        steps = file.read().strip().split("\n\n")  # 空行で区切る

    # 各ステップごとに動画生成
    for idx, step in enumerate(steps, 1):
        title, description = step.split("\n", 1)  # ステップ名と説明を分離
        prompt = f"{title}: {description}"  # プロンプトに整形
        generate_video(prompt, idx)
