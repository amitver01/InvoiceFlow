const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes=require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const authMiddleware= require("./middleware/authMiddleware");
dotenv.config();
const app = express();
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


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

app.use("/api/invoices", invoiceRoutes);
app.use("/api/auth", authRoutes);



// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Namaste - Har Har Mahadev 🚩" });
});
app.get('/api/check-auth', authMiddleware, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
