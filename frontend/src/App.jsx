import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import GeneratingPage from './pages/GeneratingPage';
import VideoPage from './pages/VideoPage';
import ArchivePage from './pages/ArchivePage';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Router>
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/generating" element={<GeneratingPage />} />
              <Route path="/video" element={<VideoPage />} />
              <Route path="/archive" element={<ArchivePage />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;