const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import multer middleware
const Invoice = require("../models/invoiceModel"); // Import the invoice schema
const router = express.Router();

// Upload and Save Invoice API
router.post("/upload", upload.single("invoice"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { invoiceNumber, vendorName, amount, dueDate, expenseCategory } = req.body;

    // Ensure required fields exist
    if (!invoiceNumber || !vendorName || !amount || !dueDate || !expenseCategory) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save invoice details in MongoDB
    const newInvoice = new Invoice({
      invoiceNumber,
      vendorName,
      amount,
      dueDate,
      expenseCategory,
      status: "Pending",
    });

    await newInvoice.save();

    res.json({
      message: "Invoice uploaded and saved successfully",
      filePath: `/uploads/${req.file.filename}`,
      invoice: newInvoice,
    });

  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

module.exports = router;
