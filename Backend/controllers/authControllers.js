const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const { logNow } = require('../middleware/logActivity');
const Log = require('../models/Log');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = '7d';
const RESET_EXPIRES_IN = '1h';

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const userAgent = req.get ? req.get('User-Agent') : req.headers['user-agent'];

    // Record an explicit login attempt entry
    await Log.create({ email: String(email).toLowerCase(), ip, userAgent, action: 'login_attempt', success: false });

    const user = await User.findOne({ email });
    if (!user) {
      await logNow({ email, ip, action: 'login_failure', userAgent, success: false });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      await logNow({ userId: user._id, email, ip, action: 'login_failure', userAgent, success: false });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET || 'dev_refresh_secret', { expiresIn: '7d' });
    await RefreshToken.create({ token: refreshToken, userId: user._id });
    res.cookie('token', token, { httpOnly: true });

    // successful login log
    await logNow({ userId: user._id, email, ip, userAgent, action: 'login_success', success: true });

    res.json({ message: 'Login successful', token, refresh_token: refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

// Demo: generate reset token and (in production) send by email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: RESET_EXPIRES_IN });
    // TODO: send resetToken via email to user.email (use nodemailer or external service)
    // For demo/testing we return the token in the response. In production, do NOT return token in body.
    res.json({ message: 'Reset token generated (demo)', resetToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'token and new password required' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ message: 'Password too short (min 6 chars)' });
    user.password = await bcrypt.hash(password, 10);
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ message: 'Missing refresh_token' });

    const stored = await RefreshToken.findOne({ token: refresh_token, revoked: false });
    if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

    try {
      jwt.verify(refresh_token, process.env.REFRESH_SECRET || 'dev_refresh_secret');
    } catch (e) {
      return res.status(401).json({ message: 'Expired/invalid refresh token' });
    }

    const user = await User.findById(stored.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '15m' }
    );

    return res.json({ token: accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};