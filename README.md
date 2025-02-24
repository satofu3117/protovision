共同開発者向け仕様書

プロジェクト名: PDFから実験動画マニュアル生成AIサービス
作成日: 2025年2月24日
作成者: [あなたの名前]

1. 目的・概要

本プロジェクトは、PDFに記載された実験手順から動画マニュアルを自動生成するAIサービスです。
	•	主な目的:
	•	科学実験の補助ツールとして、実験手順を自動解析し、動画形式でのマニュアルを生成する
	•	ユーザーが直感的に操作できるフロントエンド（ReactベースのUI）と、強固なバックエンド（Python, Flask/FastAPI, Celeryなど）による処理連携を実現する

2. システム構成

2.1. フロントエンド
	•	技術: React, Vite
	•	主な機能:
	•	PDFアップロード、進捗表示、動画再生、アーカイブ一覧表示
	•	ダーク／ライトモード切替、レスポンシブデザイン

2.2. バックエンド
	•	技術: Python, Flask または FastAPI
	•	タスクキュー: Celery（またはRQ）を使用して非同期処理を実装
	•	主な機能:
	•	PDFファイルの受信および保存
	•	PDF解析（PyPDF2、pdfminer.six等を利用）による実験手順抽出
	•	AIによるキャプション生成（例：transformersライブラリ）
	•	動画生成処理（テキスト読み上げ、画像・動画素材の統合、FFmpeg等の利用）
	•	ジョブの進捗管理と結果保存
	•	アーカイブ情報の管理（実験名、生成日時、ユーザー、更新日時、動画URL等）

2.3. データベース
	•	目的:
	•	ユーザー情報、ジョブ情報、生成結果、アーカイブデータの管理
	•	候補: PostgreSQL などのRDBMS
	•	主なテーブル設計:
	•	jobs: job_id, user_id, upload_path, status, progress, created_at, updated_at, video_url, caption
	•	archives: 実験名, generatedAt, user, updatedAt, video_url, public_flag など

3. APIエンドポイント設計

3.1. PDFアップロードエンドポイント
	•	URL: POST /upload
	•	内容:
	•	リクエスト: multipart/form-data にて PDFファイル（パラメータ名: file）を送信
	•	レスポンス例:

{
  "job_id": "abc123",
  "status": "queued"
}



3.2. 進捗確認エンドポイント
	•	URL: GET /status/<job_id>
	•	内容:
	•	リクエスト: URLパラメータ job_id
	•	レスポンス例:

{
  "job_id": "abc123",
  "progress": 70,
  "status": "processing"
}



3.3. 動画生成結果取得エンドポイント
	•	URL: GET /video/<job_id>
	•	内容:
	•	リクエスト: URLパラメータ job_id
	•	レスポンス例:

{
  "job_id": "abc123",
  "video_url": "https://www.example.com/generated-video.mp4",
  "caption": "生成された実験手順のキャプション"
}



3.4. アーカイブ一覧取得エンドポイント
	•	URL: GET /archives
	•	内容:
	•	リクエスト: クエリパラメータ
	•	type: private または public
	•	search: キーワードによる絞り込み（オプション）
	•	page、limit: ページネーション用（必要に応じて）
	•	レスポンス例:

[
  {
    "experiment": "実験A",
    "generatedAt": "2025-01-01T10:00:00",
    "user": "User1",
    "updatedAt": "2025-01-02T11:00:00",
    "video_url": "https://www.example.com/generated-video1.mp4"
  },
  {
    "experiment": "実験B",
    "generatedAt": "2025-01-03T12:00:00",
    "user": "User2",
    "updatedAt": "2025-01-04T13:00:00",
    "video_url": "https://www.example.com/generated-video2.mp4"
  }
]

4. バックグラウンド処理の詳細

4.1. PDF解析と実験手順抽出
	•	使用ライブラリ:
	•	PyPDF2, pdfminer.six など
	•	処理概要:
	•	アップロードされたPDFをパースし、実験手順（テキスト）を抽出する

4.2. キャプション生成
	•	使用ライブラリ:
	•	transformers（BERT、GPT系モデルなど）、または独自に学習済みモデル
	•	処理概要:
	•	抽出テキストから、動画用の簡潔なキャプションを生成

4.3. 動画生成
	•	使用技術:
	•	テキスト読み上げ (TTS: gTTS, pyttsx3 など)
	•	動画編集: FFmpeg を利用した画像や動画素材の合成
	•	処理概要:
	•	キャプションや抽出テキストを元に、シーンごとに動画クリップを生成・連結し、最終的な動画ファイルを作成

4.4. タスク管理
	•	使用:
	•	Celery または RQ による非同期タスク管理
	•	内容:
	•	ジョブキューに登録し、各処理の進捗（queued, processing, completed, error）を管理する

5. データベース設計概要

5.1. ジョブ情報テーブル（jobs）
	•	カラム例:
	•	job_id (主キー)
	•	user_id (アップロードユーザー識別)
	•	file_path (アップロードファイルの保存パス)
	•	status (queued, processing, completed, error)
	•	progress (0～100のパーセンテージ)
	•	video_url (動画ファイルのURL)
	•	caption (生成されたキャプション)
	•	created_at, updated_at (タイムスタンプ)

5.2. アーカイブ情報テーブル（archives）
	•	カラム例:
	•	archive_id (主キー)
	•	experiment (実験名)
	•	generatedAt (動画生成日時)
	•	user (アップロードユーザー名)
	•	updatedAt (最終更新日時)
	•	video_url (動画ファイルURL)
	•	public_flag (公開/非公開の区分)

6. エラーハンドリング・セキュリティ
	•	エラーハンドリング:
	•	各APIで入力チェック、ファイルアップロードエラー、解析エラー、生成失敗時に適切なHTTPステータスコード（400, 500など）とエラーメッセージを返す
	•	セキュリティ:
	•	ファイルアップロード時のウイルスチェック（必要に応じて）
	•	APIへのアクセスは、ユーザー認証（JWT認証など）を検討
	•	過剰なリクエストに対するレートリミッティングの実装

7. 使用技術・開発環境
	•	言語・フレームワーク:
	•	Python, Flask または FastAPI
	•	Celery または RQ（タスクキュー）
	•	PDF解析:
	•	PyPDF2, pdfminer.six
	•	AI/機械学習:
	•	transformers ライブラリ（必要に応じて事前学習済みモデルを活用）
	•	動画生成:
	•	TTSエンジン（gTTS, pyttsx3 など）
	•	FFmpeg を用いた動画編集
	•	データベース:
	•	PostgreSQL などのRDBMS
	•	開発環境:
	•	Docker コンテナ化によるローカル・本番環境の統一
	•	CI/CD パイプラインの導入検討

8. 今後の拡張・課題
	•	リアルタイム進捗通知:
	•	WebSocket や Server-Sent Events (SSE) を用いたリアルタイム通知の実装検討
	•	ユーザー認証・認可:
	•	JWTを用いた認証システムの実装、ユーザーベースのアクセス制御
	•	動画生成品質向上:
	•	AIモデルのチューニングや新たな動画生成アルゴリズムの導入
	•	モニタリング・ログ:
	•	各タスクのログ管理、エラー発生時のアラートシステムの構築

9. 連絡先・リポジトリ情報
	•	GitHubリポジトリ: [リポジトリURL]
	•	連絡先: [開発チームの連絡先またはSlackチャネルなど]