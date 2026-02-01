const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const { sendEmail } = require('./services/emailService');
const { sendSMS } = require('./services/smsService');

const initScheduler = () => {
    // Run every minute to check for reminders
    cron.schedule('* * * * *', async () => {

        // Get current time in Asia/Kolkata
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const dateObj = new Date(now);
        const currentHour = String(dateObj.getHours()).padStart(2, '0');
        const currentMinute = String(dateObj.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;

        console.log(`Checking reminders for: ${currentTime}`);

        try {
            const reminders = await Reminder.find({});

            for (const reminder of reminders) {
                for (const medicine of reminder.medicines) {
                    if (medicine.times && medicine.times.includes(currentTime)) {
                        const subject = `Medicine Reminder: ${medicine.name}`;
                        const text = `Hi ${reminder.patientName},\n\nIt's time to take your medicine: ${medicine.name} (${medicine.dosage}).\nInstruction: ${medicine.instruction}\n\nStay Healthy!`;

                        await sendEmail(reminder.patientEmail, subject, text);

                        // Send SMS if phone number exists
                        if (reminder.patientPhone) {
                            await sendSMS(reminder.patientPhone, text);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });

    console.log('Scheduler initialized (Asia/Kolkata)');
};

module.exports = initScheduler;
