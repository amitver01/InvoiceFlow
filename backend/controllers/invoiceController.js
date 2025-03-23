const Tesseract = require("tesseract.js");
const Invoice = require("../models/invoiceModel");

const extractText = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;

    // Perform OCR using Tesseract.js
    Tesseract.recognize(filePath, "eng")
      .then(async ({ data: { text } }) => {
        console.log("Extracted Text:", text);

        // Save extracted text in MongoDB
        const invoice = new Invoice({
          invoiceNumber: "AUTO-" + Date.now(),
          vendorName: "Unknown",
          amount: 0,
          dueDate: new Date(),
          expenseCategory: "Misc",
          status: "Pending",
          fileUrl: filePath,
        });

        await invoice.save();

        res.json({ message: "Text extracted & saved", extractedText: text });
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        res.status(500).json({ error: "OCR failed", details: err.message });
      });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


module.exports = { extractText };
