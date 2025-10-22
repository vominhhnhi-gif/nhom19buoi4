const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        console.log('DEBUG login body:', { email: !!email, password: !!password });
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful', token });
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

// POST /auth/refresh
exports.refresh = async (req, res) => {
    try {
        // Accept token either from cookie or Authorization header
        let token = null;
        if (req.cookies && req.cookies.token) token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ message: 'No token provided' });

        // Verify existing token (if expired, jwt.verify will throw)
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Issue a new token (same id/role)
        const newToken = jwt.sign({ id: payload.id, role: payload.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // set cookie for cookie-based clients
        try { res.cookie('token', newToken, { httpOnly: true }); } catch (e) {}
        res.json({ token: newToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};