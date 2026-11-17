import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isConnectedToMongo, memoryStore } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ JWT_SECRET is not set.');
      return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }
    const decoded = jwt.verify(token, secret);

    if (isConnectedToMongo) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = user;
    } else {
      const user = memoryStore.users.find(u => u._id === decoded.id || u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in session' });
      }
      const { password, ...userWithoutPass } = user;
      req.user = userWithoutPass;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired', error: error.message });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
};

