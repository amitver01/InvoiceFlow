const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
// API Routes
//app.use("/api/invoices", invoiceRoutes);


const limit=rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limit);
app.get('/' , (req , res)=>{
  res.json({message : "namaste - har har mahadev"});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
