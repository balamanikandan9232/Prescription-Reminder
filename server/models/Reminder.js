const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
    patientPhone: {
        type: String,
    },
    medicines: [
        {
            name: String,
            dosage: String, // e.g., "1 tablet"
            instruction: String, // e.g., "Before Food"
            times: [String], // e.g., ["08:00", "20:00"]
        }
    ],
    prescriptionImage: {
        type: String, // Path to the uploaded image
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Reminder', reminderSchema);
