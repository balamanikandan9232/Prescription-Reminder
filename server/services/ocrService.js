const Tesseract = require('tesseract.js');

const extractText = async (imagePath) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log(m) }
        );
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image');
    }
};

/**
 * Simple parser to attempt to extract medicine info from text.
 * This is heuristics-based and requires human verification.
 */
const parsePrescriptionText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const likelyMedicines = [];

    // Basic heuristic: lines that look like "Name ... 1-0-1" or contain "mg" or "tablet"
    const medicineRegex = /([a-zA-z0-9\s]+)(?:(\d+)\s*mg|tablet|cap|syr)/i;

    lines.forEach(line => {
        if (medicineRegex.test(line)) {
            likelyMedicines.push({
                name: line, // Naive: allow user to edit
                dosage: "1 unit",
                instruction: line.toLowerCase().includes("after") ? "After Food" : "Before Food",
                times: ["08:00", "20:00"] // Default placeholder
            });
        }
    });

    return likelyMedicines;
};

module.exports = { extractText, parsePrescriptionText };
