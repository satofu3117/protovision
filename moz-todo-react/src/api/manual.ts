export interface VideoResult {
    success: boolean;
    videoUrl: string;
    experiment: string;
    generatedAt: string;
    caption: string;
}

// バックエンドが利用可能かチェックする関数
export async function isBackendAvailable(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:8000/api/health');
        return response.ok;
    } catch (error) {
        console.error('バックエンドの接続確認中にエラーが発生しました:', error);
        return false;
    }
}

// モックデータを生成する関数（バックエンドが利用できない場合のフォールバック）
const generateMockVideoResult = (fileName: string, fileType: string): VideoResult => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return {
        success: true,
        videoUrl: '/src/assets/sample_experiment.mp4',
        experiment: `${fileName}から生成した実験（モック）`,
        generatedAt: formattedDate,
        caption: `これは${fileName}から自動生成された実験手順の説明です。このモードではモックデータを使用しています。`
    };
};

// マニュアルを処理する関数
export async function processManual(text: string): Promise<VideoResult> {
    try {
        const backendAvailable = await isBackendAvailable();
        
        if (!backendAvailable) {
            console.info('モックモード: マニュアル処理をシミュレートします');
            // 処理中の遅延をシミュレート
            await new Promise(resolve => setTimeout(resolve, 1500));
            return generateMockVideoResult('sample_manual.txt', 'text/plain');
        }

        const response = await fetch('http://localhost:8000/api/process-manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error('マニュアル処理に失敗しました');
        }

        const data = await response.json();
        return {
            success: true,
            videoUrl: '/src/assets/sample_experiment.mp4',
            experiment: data.experiment,
            generatedAt: data.generatedAt,
            caption: data.caption
        };
    } catch (error) {
        console.error('マニュアル処理中にエラーが発生しました:', error);
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
            videoUrl: '/src/assets/sample_experiment.mp4',
            experiment: file.name,
            generatedAt: new Date().toLocaleString(),
            caption: `${file.name}から生成された実験手順の説明です。`
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