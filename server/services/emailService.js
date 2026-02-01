const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Skipping email sending: No credentials provided.');
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${text}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Email Error:', error);
    }
};

module.exports = { sendEmail };
