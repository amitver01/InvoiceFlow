const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
//app.use("/api/invoices", invoiceRoutes);

app.get('/' , (req , res)=>{
  res.send("namaste user !!!!");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
