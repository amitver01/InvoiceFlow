const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', user: { id: newUser._id, name: newUser.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email);
    // console.log(password);
    const user = await User.findOne({ email });
   
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // console.log("generated token from login backend");
    // console.log(token);
    // console.log("generated");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,            // Only send cookie over HTTPS
      sameSite: "None",        // Required when using cross-site cookies
      path: "/",
      maxAge: 30 * 60 * 1000,  // 30 minutes
    });
    
    
  
    res.status(200).json({ token, user: { id: user._id, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const logout = async (req , res)=>{
  try{
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    
    
    res.status(200).json({ message: "Logged out successfully" });
  }
  catch(err){
    res.status(500).json({message: "SERVER ERROR"});
  }
}


module.exports = { signup, login , logout };
