import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GeneratingPage from '../GeneratingPage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: {
      videoUrl: 'test-url',
      experiment: 'test-experiment',
      generatedAt: '2024-02-26',
      caption: 'test-caption'
    }
  })
}));

describe('GeneratingPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('Progress bar advances correctly', () => {
    render(
      <BrowserRouter>
        <GeneratingPage />
      </BrowserRouter>
    );

    expect(screen.getByText('0%')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const progressText = screen.getByText(/\d+%/);
    expect(progressText).toBeInTheDocument();
    expect(parseInt(progressText.textContent)).toBeGreaterThan(0);
  });

  test('Shows completion message when finished', () => {
    render(
      <BrowserRouter>
        <GeneratingPage />
      </BrowserRouter>
    );

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(screen.getByText('生成完了!')).toBeInTheDocument();
  });

  test('Page title is displayed correctly', () => {
    render(
      <BrowserRouter>
        <GeneratingPage />
      </BrowserRouter>
    );

    expect(screen.getByText('動画マニュアルを生成中...')).toBeInTheDocument();
  });
}); 