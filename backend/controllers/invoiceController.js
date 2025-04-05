const Tesseract = require("tesseract.js");
const Invoice = require("../models/invoiceModel");
const fs = require("fs");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

const extractTextAI = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);
    const base64Image = fileData.toString("base64");

    // Dynamically get the MIME type
    const mimeType = req.file.mimetype || "image/png";

    // Call Google Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Image } },
            { text: "Extract invoice details in JSON format including invoice number, vendor name, amount, due date, and expense category." },
          ],
        },
      ],
    });

    // Extract AI Response
    const extractedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!extractedText) {
      return res.status(500).json({ error: "Failed to extract invoice data from AI response" });
    }

    let parsedData;
    try {
      const cleanedText = extractedText.replace(/```json|```/g, "").trim();
      parsedData = JSON.parse(cleanedText);
      console.log(parsedData);
    } catch (error) {
      return res.status(500).json({ error: "AI response is not in JSON format", rawData: extractedText });
    }

    // Save extracted invoice details in MongoDB
    const newInvoice = new Invoice({
      invoiceNumber: parsedData.invoice_number || `INV-${Date.now()}`,
      vendorName: parsedData.vendor_name || "Unknown",
      amount: parsedData.amount || 0,
      dueDate: parsedData.duedate ? new Date(parsedData.dueDate) : new Date(),
      expenseCategory: parsedData.expenseCategory || "Miscellaneous",
      status: "Pending",
      fileUrl: filePath,
    });

    await newInvoice.save();

    res.json({ message: "Invoice extracted & saved", invoice: newInvoice });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};




module.exports = { extractText , extractTextAI};
