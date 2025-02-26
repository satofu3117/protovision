from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .main import process_manual

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Reactアプリのオリジン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ManualRequest(BaseModel):
    text: str

@app.post("/api/process-manual")
async def process_manual_endpoint(request: ManualRequest):
    try:
        result = process_manual(request.text)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)} 