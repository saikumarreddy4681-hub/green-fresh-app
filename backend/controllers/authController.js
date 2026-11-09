import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isConnectedToMongo, memoryStore } from '../config/db.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'green_fresh_secret_key_2026_super_secure',
    { expiresIn: '30d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Secure Admin Registration: Public users cannot self-grant admin role without the secret key
    let assignedRole = 'customer';
    if (role === 'admin') {
      const validAdminSecret = process.env.ADMIN_SETUP_SECRET || 'green_fresh_admin_setup_key_2026';
      if (!adminSecretKey || adminSecretKey !== validAdminSecret) {
        return res.status(403).json({
          success: false,
          message: 'Admin account creation requires a valid administrative setup key.'
        });
      }
      assignedRole = 'admin';
    }

    if (isConnectedToMongo) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: assignedRole
      });

      const token = generateToken(newUser._id, newUser.role);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to Green Fresh.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        }
      });
    } else {
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user-' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: assignedRole,
        addresses: [],
        createdAt: new Date().toISOString()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser._id, newUser.role);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to Green Fresh.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (isConnectedToMongo) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Welcome back to Green Fresh!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses || []
        }
      });
    } else {
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Welcome back to Green Fresh!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses || []
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const userId = req.user._id || req.user.id;

    if (isConnectedToMongo) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (addresses) user.addresses = addresses;

      await user.save();
      return res.json({ success: true, message: 'Profile updated successfully', user });
    } else {
      const userIndex = memoryStore.users.findIndex(u => u._id === userId || u.id === userId);
      if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) memoryStore.users[userIndex].name = name;
      if (phone !== undefined) memoryStore.users[userIndex].phone = phone;
      if (addresses) memoryStore.users[userIndex].addresses = addresses;

      const { password, ...safeUser } = memoryStore.users[userIndex];
      return res.json({ success: true, message: 'Profile updated successfully', user: safeUser });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

