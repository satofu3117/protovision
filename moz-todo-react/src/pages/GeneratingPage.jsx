import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneratingPage.css';

const GeneratingPage = () => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

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
              navigate('/video');
            }, 2000);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [progress, navigate]);

  return (
    <div className="generating-page">
      <h2>Generating Video Manual...</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}%</p>
      {completed && <div className="completed-animation">Completed!</div>}
    </div>
  );
};

export default GeneratingPage;