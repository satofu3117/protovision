import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/manual';
import './UploadPage.css';

const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain'];
const FILE_TYPE_NAMES = {
  'application/pdf': 'PDF',
  'text/plain': 'Text'
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
      setError('Please select a PDF or text file');
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
      console.error('Error during file processing:', error);
      setError(
        'An error occurred during file processing. ' + 
        (error.message === 'Failed to fetch' ? 
          'Cannot connect to server. Please check your network connection.' : 
          'Please try again.')
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload File</h2>
      <div className="file-types">
        <p>Supported file types: PDF, Text</p>
      </div>
      <div className="upload-area">
        <input 
          type="file" 
          accept=".pdf,.txt" 
          onChange={handleFileChange}
          disabled={isLoading}
          aria-label="Select file"
          role="file"
        />
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <button 
        className="generate-button" 
        onClick={handleGenerate} 
        disabled={!file || isLoading}
      >
        {isLoading ? 'Uploading...' : 'Generate Video'}
      </button>
      {file && (
        <p className="selected-file">
          Selected file: {file.name} ({FILE_TYPE_NAMES[file.type]})
        </p>
      )}
    </div>
  );
};

export default UploadPage;