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
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
                    placeholder="Enter manual text"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Start Processing'}
                </button>
            </form>

            {error && <div className="error">{error}</div>}
            {result && (
                <div className="result">
                    <h3>Processing Result:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
} 