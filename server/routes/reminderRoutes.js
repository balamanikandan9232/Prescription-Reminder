const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPrescription, createReminder, getReminders } = require('../controllers/reminderController');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Create uploads dir if it doesn't exist (sync for simplicity in config)
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('prescription'), uploadPrescription);
router.post('/', createReminder);
router.get('/', getReminders);

module.exports = router;
