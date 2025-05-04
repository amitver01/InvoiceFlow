const express = require("express");
const {getDashboardData}=require("../controllers/dashboardController");
const router=express.Router();
const middleware = require("../middleware/authMiddleware")

router.get("/dashboard" , middleware , getDashboardData);

module.exports = router;