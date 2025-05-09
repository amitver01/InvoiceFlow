const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes=require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const authMiddleware= require("./middleware/authMiddleware");
const dashBoard=require("./routes/dashBoard");
dotenv.config();
const app = express();
app.use(cookieParser());


app.use(cors({
  origin: "https://invoice-flow-697x.vercel.app",
  credentials: true,
}));


app.use(express.json());

app.set('trust proxy', 1);
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
app.use("/api" , dashBoard);


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
