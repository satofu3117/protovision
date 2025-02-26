from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
import os
from typing import Dict, Any
import time
import random

# FastAPIアプリケーションの作成
app = FastAPI(title="動画マニュアル生成APIサーバー")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# アップロードされたファイルを保存するディレクトリを作成
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# サンプル動画URL
SAMPLE_VIDEOS = {
    "application/pdf": "https://www.youtube.com/embed/XbGs_qK2PQA",
    "text/plain": "https://www.youtube.com/embed/dQw4w9WgXcQ"
}

# ヘルスチェックエンドポイント
@app.get("/api/health")
async def health_check() -> Dict[str, str]:
    """サーバーの健康状態を確認するエンドポイント"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ファイルアップロードエンドポイント
@app.post("/api/upload-file")
async def upload_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """ファイルをアップロードして処理するエンドポイント"""
    # ファイルの保存
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # 処理に時間がかかることをシミュレート
    time.sleep(2)
    
    # レスポンスの生成
    now = datetime.now()
    formatted_date = now.strftime("%Y-%m-%d %H:%M")
    
    # ファイルタイプに応じたサンプル動画URLを選択
    video_url = SAMPLE_VIDEOS.get(file.content_type, SAMPLE_VIDEOS["application/pdf"])
    
    return {
        "success": True,
        "videoUrl": video_url,
        "experiment": f"{file.filename}から生成した実験",
        "generatedAt": formatted_date,
        "caption": f"これは{file.filename}から自動生成された実験手順の説明です。バックエンドサーバーで処理されました。"
    }

# テキスト処理エンドポイント
@app.post("/api/process-manual")
async def process_manual(request: Dict[str, str]) -> Dict[str, Any]:
    """テキストを処理するエンドポイント"""
    text = request.get("text", "")
    
    # 処理に時間がかかることをシミュレート
    time.sleep(1)
    
    # 処理されたテキストを返す
    return {
        "success": True,
        "result": f"処理されたテキスト: {text[:50]}..."
    }

# サーバーを起動する関数
def start_server():
    """サーバーを起動する関数"""
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

# メイン関数（直接実行された場合に実行される）
if __name__ == "__main__":
    start_server() 