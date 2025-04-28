const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import multer middleware
const Invoice = require("../models/invoiceModel"); // Import the invoice schema
const router = express.Router();
const { extractTextAI } = require("../controllers/invoiceController");


router.post("/extract", upload.single("invoice"), extractTextAI);

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
