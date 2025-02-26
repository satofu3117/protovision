// VideoPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VideoPage.css';

const VideoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experiment, generatedAt, caption, videoUrl } = location.state || { 
    experiment: "デフォルト実験名", 
    generatedAt: "不明", 
    caption: "ここに実験手順の詳細キャプションが表示されます。",
    videoUrl: "https://www.youtube.com/embed/XbGs_qK2PQA"
  };

  const [archived, setArchived] = useState(false);

  const handleArchive = () => {
    setArchived(true);
  };

  const handleGoToArchives = () => {
    navigate('/archive');
  };

  return (
    <div className="video-page">
      <div className="video-header">
        <h2 className="video-title">{experiment}</h2>
        <span className="video-generatedAt">{generatedAt}</span>
      </div>
      <div className="video-container">
        <iframe 
          width="100%" 
          height="480" 
          src={videoUrl} 
          title="Video Manual" 
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-caption">
        <p>{caption}</p>
      </div>
      <div className="archive-actions">
        <button 
          className={`archive-button ${archived ? "archived" : ""}`} 
          onClick={handleArchive} 
          disabled={archived}
        >
          {archived ? "アーカイブ済み" : "アーカイブする"}
        </button>
        <button className="go-to-archives-button" onClick={handleGoToArchives}>
          アーカイブ一覧へ
        </button>
      </div>
    </div>
  );
};

export default VideoPage;