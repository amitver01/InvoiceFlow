const mongoose = require('mongoose');

const Invoice = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  vendorName: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  expenseCategory: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
})

module.exports= mongoose.model('Invoice' , Invoice );