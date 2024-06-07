const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

console.log('Loaded authController');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(`Error during registration: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  await check('email', 'Please include a valid email').isEmail().run(req);
  await check('password', 'Password is required').exists().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isMatch}`);
    if (!isMatch) {
      console.error('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
