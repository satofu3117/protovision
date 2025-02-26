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

  test('PDFファイルのアップロードが正常に動作する', async () => {
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

  test('テキストファイルのアップロードが正常に動作する', async () => {
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

  test('非対応のファイル形式がアップロードされた場合にエラーを表示する', () => {
    const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <BrowserRouter>
        <UploadPage />
      </BrowserRouter>
    );

    const input = screen.getByRole('file');
    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(screen.getByText('PDFまたはテキストファイルを選択してください')).toBeInTheDocument();
  });

  test('アップロード中はボタンとファイル入力が無効になる', async () => {
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
    expect(screen.getByText('アップロード中...')).toBeInTheDocument();
  });

  test('アップロードエラー時にエラーメッセージを表示する', async () => {
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
      expect(screen.getByText('動画生成に失敗しました。もう一度お試しください。')).toBeInTheDocument();
    });
  });
}); 