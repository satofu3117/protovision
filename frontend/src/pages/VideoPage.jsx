// VideoPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VideoPage.css';
import sampleVideo from '../assets/videos/sample_experiment.mp4';

const VideoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { experiment, generatedAt, caption, videoUrl } = location.state || { 
    experiment: "Default Experiment", 
    generatedAt: "Unknown", 
    caption: "Experiment procedure details will be displayed here.",
    videoUrl: sampleVideo
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
        <video 
          width="100%" 
          height="480" 
          controls
          style={{ backgroundColor: '#000' }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support video playback.
        </video>
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
          {archived ? "Archived" : "Archive"}
        </button>
        <button className="go-to-archives-button" onClick={handleGoToArchives}>
          Go to Archives
        </button>
      </div>
    </div>
  );
};

export default VideoPage;