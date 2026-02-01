import { useState } from 'react';
import { uploadPrescription as uploadAPI } from '../services/api';

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('prescription', file);

        try {
            const { data } = await uploadAPI(formData);
            onUploadSuccess(data);
        } catch (err) {
            console.error(err);
            setError('Failed to process image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Upload Prescription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Processing via OCR...' : 'Upload & Analyze'}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
