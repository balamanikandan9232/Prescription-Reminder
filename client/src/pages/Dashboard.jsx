import { useEffect, useState } from 'react';
import { getReminders } from '../services/api';

const Dashboard = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const { data } = await getReminders();
            setReminders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Active Reminders</h2>

            {reminders.length === 0 ? (
                <p className="text-gray-500">No reminders set yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reminders.map((reminder) => (
                        <div key={reminder._id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                            <div className="p-4 bg-blue-50 border-b">
                                <h3 className="font-bold text-lg">{reminder.patientName}</h3>
                                <p className="text-sm text-gray-600">{reminder.patientEmail}</p>
                            </div>
                            <div className="p-4">
                                <h4 className="font-medium text-gray-700 mb-2">Medicines:</h4>
                                <ul className="space-y-2">
                                    {reminder.medicines.map((med, idx) => (
                                        <li key={idx} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex justify-between">
                                                <span className="font-semibold">{med.name}</span>
                                                <span className="text-gray-500">{med.dosage}</span>
                                            </div>
                                            <div className="text-gray-600 text-xs mt-1">
                                                {med.instruction} @ {med.times && med.times.join(', ')}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-3 text-right text-xs text-gray-400">
                                Created: {new Date(reminder.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
