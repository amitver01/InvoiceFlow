const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
     //console.log("Cookies:", req.cookies.token);
    // console.log("Raw Cookie Header:", req.headers.cookie);

  const token = req.cookies.token; 
    // console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // console.log("token received");
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = decoded; // optionally attach user info
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = authMiddleware;
