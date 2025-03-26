const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import multer middleware
const Invoice = require("../models/invoiceModel"); // Import the invoice schema
const router = express.Router();
const { extractText } = require("../controllers/invoiceController");
// Upload and Save Invoice API
// router.post("/upload", upload.single("invoice"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const { invoiceNumber, vendorName, amount, dueDate, expenseCategory } = req.body;

//     // Ensure required fields exist
//     if (!invoiceNumber || !vendorName || !amount || !dueDate || !expenseCategory) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Save invoice details in MongoDB
//     const newInvoice = new Invoice({
//       invoiceNumber,
//       vendorName,
//       amount,
//       dueDate,
//       expenseCategory,
//       status: "Pending",
//     });

//     await newInvoice.save();

//     res.json({
//       message: "Invoice uploaded and saved successfully",
//       filePath: `/uploads/invoices/${req.file.filename}`,
//       invoice: newInvoice,
//     });

//   } catch (error) {
//     res.status(500).json({ error: "Upload failed", details: error.message });
//   }
// });

router.post("/extract", upload.single("invoice"), extractText);

router.get("/getAllListed" , async(req , res) =>{
    try{
        const invoices = await Invoice.find();
    res.json(invoices);
    }catch(error){
        res.status(500).json({ error: "Failed to fetch invoices", details: error.message });
    }
});

router.put("/update-status/:id" , async(req , res) => {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if(! invoice) return res.status(400).json({error: "INVOICE NOT FOUND"});

    invoice.status=status;

    await invoice.save();

    res.json({ message: "Invoice status updated successfully" });
})


module.exports = router;
