const Reminder = require('../models/Reminder');
const { extractText, parsePrescriptionText } = require('../services/ocrService');
const fs = require('fs');
const path = require('path');

// 1. Upload & Process Image
const uploadPrescription = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imagePath = req.file.path;
        const rawText = await extractText(imagePath);
        const parsedData = parsePrescriptionText(rawText);

        // Return the raw text and best-guess parsed data for the user to edit
        res.json({
            success: true,
            imagePath,
            rawText,
            data: parsedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing image' });
    }
};

// 2. Create Reminder (Final Save)
const createReminder = async (req, res) => {
    try {
        const { patientName, patientEmail, patientPhone, medicines, prescriptionImage } = req.body;

        const newReminder = new Reminder({
            patientName,
            patientEmail,
            patientPhone,
            medicines,
            prescriptionImage
        });

        await newReminder.save();
        res.status(201).json({ success: true, reminder: newReminder });
    } catch (error) {
        res.status(500).json({ message: 'Error saving reminder', error: error.message });
    }
};

// 3. Get All Reminders
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find().sort({ createdAt: -1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reminders' });
    }
};

module.exports = { uploadPrescription, createReminder, getReminders };
