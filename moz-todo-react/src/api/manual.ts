export interface VideoResult {
    success: boolean;
    videoUrl: string;
    experiment: string;
    generatedAt: string;
    caption: string;
}

// バックエンドが利用可能かを確認する関数
const isBackendAvailable = async (): Promise<boolean> => {
    try {
        console.log('バックエンドサーバーの可用性を確認します...');
        const response = await fetch('http://localhost:8000/api/health', { 
            method: 'GET',
            signal: AbortSignal.timeout(3000) // 3秒でタイムアウト
        });
        const data = await response.json();
        console.log('バックエンドサーバーのステータス:', data);
        return response.ok;
    } catch (error) {
        console.error('バックエンドサーバーに接続できません:', error);
        return false;
    }
};

// モックデータを生成する関数（バックエンドが利用できない場合のフォールバック）
const generateMockVideoResult = (fileName: string, fileType: string): VideoResult => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // ファイルタイプに応じてサンプル動画を選択
    const videoUrls = {
        'application/pdf': 'https://www.youtube.com/embed/XbGs_qK2PQA',
        'text/plain': 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };
    
    return {
        success: true,
        videoUrl: videoUrls[fileType] || 'https://www.youtube.com/embed/XbGs_qK2PQA',
        experiment: `${fileName}から生成した実験（モック）`,
        generatedAt: formattedDate,
        caption: `これは${fileName}から自動生成された実験手順の説明です。このモードではモックデータを使用しています。`
    };
};

export async function processManual(manualText: string): Promise<string> {
    try {
        // 実際のAPIリクエスト
        const response = await fetch('http://localhost:8000/api/process-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: manualText }),
        });

        if (!response.ok) {
            throw new Error('APIリクエストが失敗しました');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'APIリクエストが失敗しました');
        }

        return data.result;
    } catch (error) {
        console.error('マニュアル処理中にエラーが発生しました:', error);
        
        // バックエンドが利用可能かチェック
        const backendAvailable = await isBackendAvailable();
        
        if (!backendAvailable) {
            // モックレスポンスを返す
            console.info('モックモード: テキスト処理をシミュレートします');
            return 'モックモードで処理されたテキスト: ' + manualText.substring(0, 50) + '...';
        }
        
        throw error;
    }
}

export async function uploadFile(file: File): Promise<VideoResult> {
    try {
        console.log('ファイルをアップロードします:', file.name, file.type);
        
        // 実際のAPIリクエスト
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('ファイルアップロードに失敗しました');
        }

        const data = await response.json();
        return {
            success: true,
            videoUrl: data.videoUrl,
            experiment: data.experiment,
            generatedAt: data.generatedAt,
            caption: data.caption
        };
    } catch (error) {
        console.error('ファイルアップロード中にエラーが発生しました:', error);
        
        // バックエンドが利用可能かチェック
        const backendAvailable = await isBackendAvailable();
        
        if (!backendAvailable) {
            // モックレスポンスを返す
            console.info('モックモード: ファイルアップロードをシミュレートします', file.name, file.type);
            // 処理中の遅延をシミュレート
            await new Promise(resolve => setTimeout(resolve, 1500));
            return generateMockVideoResult(file.name, file.type);
        }
        
        throw error;
    }
} 