import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ReviewForm from '../components/ReviewForm';

const Home = () => {
    const [step, setStep] = useState('upload'); // upload, review, success
    const [extractedData, setExtractedData] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleUploadSuccess = (data) => {
        setExtractedData(data.data); // parsed medicines
        setUploadedImage(data.imagePath);
        setStep('review');
    };

    const handleSaveSuccess = () => {
        setStep('success');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {step === 'upload' && (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6 text-blue-800">Prescription Reminder</h1>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Upload a photo of your prescription. We'll use AI to read it and set up automatic reminders for you.</p>
                    <UploadForm onUploadSuccess={handleUploadSuccess} />
                </div>
            )}

            {step === 'review' && (
                <ReviewForm
                    initialData={extractedData}
                    imagePath={uploadedImage}
                    onSuccess={handleSaveSuccess}
                    onCancel={() => setStep('upload')}
                />
            )}

            {step === 'success' && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-3xl font-bold mb-2">Reminders Set!</h2>
                    <p className="text-gray-600 mb-6">You will receive email notifications at the scheduled times.</p>
                    <button onClick={() => setStep('upload')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Add Another</button>
                </div>
            )}
        </div>
    );
};

export default Home;
