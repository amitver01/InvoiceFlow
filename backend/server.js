const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Rate Limiting (To prevent abuse)
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limit);

// API Routes
const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Namaste - Har Har Mahadev 🚩" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
