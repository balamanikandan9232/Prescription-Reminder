const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Prescription Reminder API is running...');
});

// Import Routes
const reminderRoutes = require('./routes/reminderRoutes');
app.use('/api/reminders', reminderRoutes);

// Serve static uploads
app.use('/uploads', express.static('uploads'));

const initScheduler = require('./scheduler');
initScheduler();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
