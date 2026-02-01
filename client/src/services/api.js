import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/reminders',
});

export const uploadPrescription = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

export const createReminder = (data) => API.post('/', data);
export const getReminders = () => API.get('/');
