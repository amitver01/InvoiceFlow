// controllers/dashboardController.js
const Invoice = require('../models/invoiceModel');

const getDashboardData = async (req, res) => {
  try {
  
    const totalInvoices = await Invoice.countDocuments({});

    const revenueResult = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentInvoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('invoiceNumber vendorName amount status dueDate createdAt');

    // Send back dashboard data
    res.json({
      totalInvoices,
      totalRevenue,
      recentInvoices
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
};

module.exports = { getDashboardData };
