const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.JWT_ADMIN;
const admin = require("../models/adminSchema");

const authMiddleware = async (req, res, next) => {

  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {

    const decoded = jwt.verify(token, secretKey);
    
    const user = await admin.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    // Attach user object to request for further use
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = authMiddleware;
