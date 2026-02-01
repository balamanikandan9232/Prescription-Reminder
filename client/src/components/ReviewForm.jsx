import { useState } from 'react';
import { createReminder } from '../services/api';

const ReviewForm = ({ initialData, imagePath, onSuccess, onCancel }) => {
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('test@example.com');
    const [patientPhone, setPatientPhone] = useState('');
    const [medicines, setMedicines] = useState(initialData || []);
    const [loading, setLoading] = useState(false);

    const handleMedicineChange = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', instruction: 'Before Food', times: [] }]);
    };

    const removeMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createReminder({
                patientName,
                patientEmail,
                patientPhone,
                medicines,
                prescriptionImage: imagePath
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to save reminder.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Review & Confirm Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                        <input required type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email for Reminders</label>
                        <input required type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                        <input type="tel" placeholder="+1234567890" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Medicines Detected</h3>
                    {medicines.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border relative">
                            <button type="button" onClick={() => removeMedicine(index)} className="absolute top-2 right-2 text-red-500 text-sm hover:underline">Remove</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Medicine Name" value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)} className="border p-2 rounded" />
                                <input placeholder="Dosage (e.g. 1 tablet)" value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)} className="border p-2 rounded" />
                                <select value={med.instruction} onChange={e => handleMedicineChange(index, 'instruction', e.target.value)} className="border p-2 rounded">
                                    <option value="Before Food">Before Food</option>
                                    <option value="After Food">After Food</option>
                                </select>
                                <input placeholder="Times (comma sep, e.g. 08:00,20:00)"
                                    value={Array.isArray(med.times) ? med.times.join(',') : med.times}
                                    onChange={e => handleMedicineChange(index, 'times', e.target.value.split(','))}
                                    className="border p-2 rounded"
                                />
                                {med.times && med.times.length > 0 && Array.isArray(med.times) && (
                                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 mt-2">
                                        {med.times.map((time, tIndex) => (
                                            time.trim() && (
                                                <a
                                                    key={tIndex}
                                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Medicine: ' + med.name)}&details=${encodeURIComponent('Dosage: ' + med.dosage + '\\nInstruction: ' + med.instruction)}&dates=${new Date().toISOString().slice(0, 10).replace(/-/g, '')}T${time.replace(':', '')}00/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}T${time.replace(':', '')}00&recur=RRULE:FREQ=DAILY`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                                >
                                                    📅 Add {time} to Calendar
                                                </a>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addMedicine} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Medicine</button>
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{loading ? 'Saving...' : 'Confirm & Schedule'}</button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
