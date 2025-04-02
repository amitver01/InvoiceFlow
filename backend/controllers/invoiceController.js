const Tesseract = require("tesseract.js");
const Invoice = require("../models/invoiceModel");
const OpenAI = require("openai");
const fs = require("fs");

require("dotenv").config();
//console.log("API Key:", process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});


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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Convert the image to Base64 format
    const base64Image = fileData.toString("base64");

    // Send the image to OpenAI Vision API for processing
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an expert at extracting structured invoice data from images." },
        { role: "user", content: "Extract invoice details (invoice number, vendor name, amount, due date, expense category) from this image." },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract key invoice details from this image." },
            { type: "image_url", image_url: `data:image/png;base64,${base64Image}` } // Assuming invoice is in PNG format
          ]
        }
      ]
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    // Save extracted invoice details in MongoDB
    const newInvoice = new Invoice({
      invoiceNumber: parsedData.invoiceNumber || `INV-${Date.now()}`,
      vendorName: parsedData.vendorName || "Unknown",
      amount: parsedData.amount || 0,
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : new Date(),
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
