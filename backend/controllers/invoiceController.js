const Invoice = require("../models/invoiceModel");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractTextAI = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Use buffer instead of file path
    const base64Image = req.file.buffer.toString("base64");

    // Get MIME type from file
    const mimeType = req.file.mimetype || "image/png";

    // Call Gemini AI
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

    const extractedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!extractedText) {
      return res.status(500).json({ error: "Failed to extract invoice data from AI response" });
    }

    let parsedData;
    try {
      const cleanedText = extractedText.replace(/```json|```/g, "").trim();
      parsedData = JSON.parse(cleanedText);
      //console.log(parsedData);
    } catch (error) {
      return res.status(500).json({ error: "AI response is not in JSON format", rawData: extractedText });
    }

    // Save invoice to DB
    const newInvoice = new Invoice({
      userId: req.user.id, 
      invoiceNumber: parsedData.invoice_number || `INV-${Date.now()}`,
      vendorName: parsedData.vendor_name || "Unknown",
      amount: parsedData.amount || 0,
      dueDate: parsedData.duedate ? new Date(parsedData.duedate) : new Date(),
      expenseCategory: parsedData.expenseCategory || "Miscellaneous",
      status: "Pending",
      fileUrl: "In-memory upload", // you can store base64 or skip this
    });

    await newInvoice.save();

    res.json({ message: "Invoice extracted & saved" });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { extractTextAI };
