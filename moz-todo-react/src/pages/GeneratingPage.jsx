import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GeneratingPage.css';

const GeneratingPage = () => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const videoData = location.state;

  useEffect(() => {
    let interval = null;
    if (progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev + 10 >= 100) {
            clearInterval(interval);
            setProgress(100);
            setCompleted(true);
            // 「Completed!」アニメーション表示後、2秒で /video ページに遷移
            setTimeout(() => {
              navigate('/video', { state: videoData });
            }, 2000);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [progress, navigate, videoData]);

  return (
    <div className="generating-page">
      <h2>動画マニュアルを生成中...</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}%</p>
      {completed && <div className="completed-animation">生成完了!</div>}
    </div>
  );
};

export default GeneratingPage;