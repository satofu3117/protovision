import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VideoPage from '../VideoPage';

const mockNavigate = jest.fn();
const mockLocation = {
  state: {
    experiment: 'テスト実験',
    generatedAt: '2024-02-26',
    caption: 'テストキャプション',
    videoUrl: 'https://example.com/test-video'
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('VideoPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('動画情報が正しく表示される', () => {
    render(
      <BrowserRouter>
        <VideoPage />
      </BrowserRouter>
    );

    expect(screen.getByText('テスト実験')).toBeInTheDocument();
    expect(screen.getByText('2024-02-26')).toBeInTheDocument();
    expect(screen.getByText('テストキャプション')).toBeInTheDocument();
  });

  test('iframeが正しい属性で表示される', () => {
    render(
      <BrowserRouter>
        <VideoPage />
      </BrowserRouter>
    );

    const iframe = screen.getByTitle('Video Manual');
    expect(iframe).toHaveAttribute('src', 'https://example.com/test-video');
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '480');
  });

  test('アーカイブボタンが正しく動作する', () => {
    render(
      <BrowserRouter>
        <VideoPage />
      </BrowserRouter>
    );

    const archiveButton = screen.getByText('アーカイブする');
    fireEvent.click(archiveButton);

    expect(screen.getByText('アーカイブ済み')).toBeInTheDocument();
    expect(archiveButton).toBeDisabled();
  });

  test('アーカイブ一覧へボタンが正しく動作する', () => {
    render(
      <BrowserRouter>
        <VideoPage />
      </BrowserRouter>
    );

    const goToArchivesButton = screen.getByText('アーカイブ一覧へ');
    fireEvent.click(goToArchivesButton);

    expect(mockNavigate).toHaveBeenCalledWith('/archive');
  });

  test('状態がない場合にデフォルト値が表示される', () => {
    mockLocation.state = null;

    render(
      <BrowserRouter>
        <VideoPage />
      </BrowserRouter>
    );

    expect(screen.getByText('デフォルト実験名')).toBeInTheDocument();
    expect(screen.getByText('不明')).toBeInTheDocument();
    expect(screen.getByText('ここに実験手順の詳細キャプションが表示されます。')).toBeInTheDocument();

    // テスト後に状態を元に戻す
    mockLocation.state = {
      experiment: 'テスト実験',
      generatedAt: '2024-02-26',
      caption: 'テストキャプション',
      videoUrl: 'https://example.com/test-video'
    };
  });
}); 