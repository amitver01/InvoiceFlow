const express=require("express");
const {signup , login}=require("../controllers/authController");

const router=express.Router();

router.post("/login" , login);
router.post("/signup" , signup);

// Test route to check cookies
router.get("/test-cookie", (req, res) => {
  console.log("Cookies received at /test-cookie:", req.cookies);
  res.json({ cookies: req.cookies });
});

module.exports = router;
