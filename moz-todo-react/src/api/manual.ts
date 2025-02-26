import sampleVideo from '../assets/sample_experiment.mp4';

export interface VideoResult {
    success: boolean;
    videoUrl: string;
    experiment: string;
    generatedAt: string;
    caption: string;
}

// Function to check if backend is available
export async function isBackendAvailable(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:8000/api/health');
        return response.ok;
    } catch (error) {
        console.error('Error checking backend connection:', error);
        return false;
    }
}

// Generate mock data when backend is unavailable
const generateMockVideoResult = (fileName: string, fileType: string): VideoResult => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return {
        success: true,
        videoUrl: sampleVideo,
        experiment: `Experiment generated from ${fileName}`,
        generatedAt: formattedDate,
        caption: `This is an automatically generated experiment procedure from ${fileName}. Using mock data in this mode.`
    };
};

// Process manual text
export async function processManual(text: string): Promise<VideoResult> {
    try {
        const backendAvailable = await isBackendAvailable();
        
        if (!backendAvailable) {
            console.info('Mock mode: Simulating manual processing');
            // Simulate processing delay
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
            throw new Error('Failed to process manual');
        }

        const data = await response.json();
        return {
            success: true,
            videoUrl: sampleVideo,
            experiment: data.experiment,
            generatedAt: data.generatedAt,
            caption: data.caption
        };
    } catch (error) {
        console.error('Error during manual processing:', error);
        throw error;
    }
}

export async function uploadFile(file: File): Promise<VideoResult> {
    try {
        console.log('Uploading file:', file.name, file.type);
        
        // Actual API request
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('File upload failed');
        }

        const data = await response.json();
        return {
            success: true,
            videoUrl: sampleVideo,
            experiment: file.name,
            generatedAt: new Date().toLocaleString(),
            caption: `Experiment procedure generated from ${file.name}`
        };
    } catch (error) {
        console.error('Error during file upload:', error);
        
        // Check if backend is available
        const backendAvailable = await isBackendAvailable();
        
        if (!backendAvailable) {
            // Return mock response
            console.info('Mock mode: Simulating file upload', file.name, file.type);
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return generateMockVideoResult(file.name, file.type);
        }
        
        throw error;
    }
} 