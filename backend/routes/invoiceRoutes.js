const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import multer middleware
const Invoice = require("../models/invoiceModel"); // Import the invoice schema
const router = express.Router();
const { extractTextAI } = require("../controllers/invoiceController");
const middleware = require("../middleware/authMiddleware")

router.post("/extract", middleware ,upload.single("invoice"), extractTextAI);

router.get("/getAllListed" , middleware ,async(req , res) =>{
    try {
        const userId = req.user.id; // set in authMiddleware
        const invoices = await Invoice.find({ userId });
        res.json(invoices);
      } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
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
