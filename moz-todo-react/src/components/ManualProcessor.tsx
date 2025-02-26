import React, { useState } from 'react';
import { processManual } from '../api/manual';

export function ManualProcessor() {
    const [manualText, setManualText] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const processedResult = await processManual(manualText);
            setResult(processedResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="マニュアルテキストを入力してください"
                />
                <button type="submit" disabled={loading}>
                    {loading ? '処理中...' : '処理開始'}
                </button>
            </form>

            {error && <div className="error">{error}</div>}
            {result && (
                <div className="result">
                    <h3>処理結果:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
} 