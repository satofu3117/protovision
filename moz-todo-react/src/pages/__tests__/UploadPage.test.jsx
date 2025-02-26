import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UploadPage from '../UploadPage';
import { uploadFile } from '../../api/manual';

// モックの設定
jest.mock('../../api/manual');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('UploadPage', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  test('PDF file upload works correctly', async () => {
    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    uploadFile.mockResolvedValueOnce({
      videoUrl: 'test-url',
      experiment: 'test-experiment',
      generatedAt: '2024-02-26',
      caption: 'test-caption'
    });

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const fileInput = screen.getByRole('button', { name: /動画を生成/i });
    expect(fileInput).toBeDisabled();

    const input = screen.getByRole('file');
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(fileInput).toBeEnabled();
    expect(screen.getByText(/test.pdf \(PDF\)/)).toBeInTheDocument();

    fireEvent.click(fileInput);

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  test('Text file upload works correctly', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    uploadFile.mockResolvedValueOnce({
      videoUrl: 'test-url',
      experiment: 'test-experiment',
      generatedAt: '2024-02-26',
      caption: 'test-caption'
    });

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const fileInput = screen.getByRole('button', { name: /動画を生成/i });
    expect(fileInput).toBeDisabled();

    const input = screen.getByRole('file');
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(fileInput).toBeEnabled();
    expect(screen.getByText(/test.txt \(テキスト\)/)).toBeInTheDocument();

    fireEvent.click(fileInput);

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  test('Shows error for unsupported file types', () => {
    const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const input = screen.getByRole('file');
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(screen.getByText('PDF or text file must be selected')).toBeInTheDocument();
  });

  test('Button and file input are disabled during upload', async () => {
    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    uploadFile.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const input = screen.getByRole('file');
    const button = screen.getByRole('button', { name: /動画を生成/i });

    fireEvent.change(input, { target: { files: [mockFile] } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(input).toBeDisabled();
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  test('Shows error message when upload fails', async () => {
    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    uploadFile.mockRejectedValueOnce(new Error('Upload failed'));

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const input = screen.getByRole('file');
    fireEvent.change(input, { target: { files: [mockFile] } });
    
    const button = screen.getByRole('button', { name: /動画を生成/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Video generation failed. Please try again.')).toBeInTheDocument();
    });
  });
}); 