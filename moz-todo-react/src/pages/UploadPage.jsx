import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/manual';
import './UploadPage.css';

const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain'];
const FILE_TYPE_NAMES = {
  'application/pdf': 'PDF',
  'text/plain': 'テキスト'
};

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('PDFまたはテキストファイルを選択してください');
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await uploadFile(file);
      
      navigate('/generating', { 
        state: {
          videoUrl: result.videoUrl,
          experiment: result.experiment,
          generatedAt: result.generatedAt,
          caption: result.caption
        }
      });
    } catch (error) {
      console.error('ファイル処理中のエラー:', error);
      setError(
        'ファイル処理中にエラーが発生しました。' + 
        (error.message === 'Failed to fetch' ? 
          'サーバー接続できません。ネットワーク接続を確認してください。' : 
          'もう一度お試しください。')
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h2>ファイルをアップロード</h2>
      <div className="file-types">
        <p>対応ファイル形式: PDF, テキスト</p>
      </div>
      <div className="upload-area">
        <input 
          type="file" 
          accept=".pdf,.txt" 
          onChange={handleFileChange}
          disabled={isLoading}
          aria-label="ファイルを選択"
          role="file"
        />
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <button 
        className="generate-button" 
        onClick={handleGenerate} 
        disabled={!file || isLoading}
      >
        {isLoading ? 'アップロード中...' : '動画を生成'}
      </button>
      {file && (
        <p className="selected-file">
          選択されたファイル: {file.name} ({FILE_TYPE_NAMES[file.type]})
        </p>
      )}
    </div>
  );
};

export default UploadPage;