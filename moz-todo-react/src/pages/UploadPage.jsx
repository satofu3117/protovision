import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerate = () => {
    // PDFアップロード後の処理（バックエンド連携など）を実装してください
    navigate('/generating');
  };

  return (
    <div className="upload-page">
      <h2>Upload PDF File</h2>
      <div className="upload-area">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <button className="generate-button" onClick={handleGenerate} disabled={!file}>
        Generate Video Manual
      </button>
    </div>
  );
};

export default UploadPage;