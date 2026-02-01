const sendSMS = async (to, text) => {
    console.log(`[Textbelt] Sending SMS to ${to}...`);

    try {
        const response = await fetch('https://textbelt.com/text', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: to,
                message: text,
                key: 'textbelt',
            }),
        });

        const data = await response.json();

        if (data.success) {
            console.log(`[Textbelt] SMS sent successfully to ${to}. ID: ${data.textId}, Quota remaining: ${data.quotaRemaining}`);
        } else {
            console.error(`[Textbelt] SMS failed: ${data.error}`);
        }
    } catch (error) {
        console.error('[Textbelt] Error sending SMS:', error);
    }
};

module.exports = { sendSMS };
