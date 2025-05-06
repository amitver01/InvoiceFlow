// controllers/dashboardController.js
const Invoice = require('../models/invoiceModel');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // assuming req.user is set via auth middleware
    
    //console.log(userId);
    // Count only invoices created by the logged-in user
    const totalInvoices = await Invoice.countDocuments({ userId });
    if (totalInvoices === 0) {
      return res.status(200).json({
        message: 'No invoices found for the logged-in user.',
        totalInvoices,
        totalRevenue: 0,
        recentInvoices: []
      });
    }
    // Calculate total revenue for the logged-in user
    const revenueResult = await Invoice.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    //console.log(totalInvoices)
    // Fetch the 20 most recent invoices for the user
    const recentInvoices = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('invoiceNumber vendorName amount status dueDate createdAt');

    // Send back filtered dashboard data
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
