const User = require('../models/User'); // Import model User
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

// Helper to remove sensitive fields
function sanitize(user) {
    const obj = user.toObject ? user.toObject() : user;
    if (obj.password) delete obj.password;
    return obj;
}

// GET /users (Lấy tất cả users)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Tìm tất cả users
        res.json(users.map(sanitize));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /users (Tạo user mới)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash, role: role || 'user' });
        const newUser = await user.save();
        res.status(201).json(sanitize(newUser));
        } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Put /users/:id (Cập nhật user theo ID)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Tìm user theo ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
        if (req.body.role) user.role = req.body.role;
        const updatedUser = await user.save();
        res.json(sanitize(updatedUser));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xoá user (nếu cần)
exports.deleteUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const requester = req.user; // set by auth middleware
        // allow if admin or deleting own account
        if (!requester) return res.status(401).json({ message: 'Unauthorized' });
        if (requester.role !== 'admin' && requester.id !== targetId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const deleted = await User.findByIdAndDelete(targetId);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Profile endpoints (Activity 2)
// These assume an auth middleware sets req.user = { id, role }
exports.getProfile = async (req, res) => {
    try {
const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(sanitize(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, avatar, password } = req.body;
        // basic validations
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ message: 'Invalid name' });
            user.name = name.trim();
        }
        if (avatar !== undefined) {
            if (typeof avatar !== 'string') return res.status(400).json({ message: 'Invalid avatar' });
            user.avatar = avatar;
        }
        if (password !== undefined) {
            if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ message: 'Password too short (min 6 chars)' });
            user.password = await bcrypt.hash(password, 10);
        }

        user.updatedAt = Date.now();
        const updated = await user.save();
        res.json(sanitize(updated));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /profile/upload-avatar
// Body: { avatarUrl: string }
exports.uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { avatarUrl } = req.body;
        if (!avatarUrl || typeof avatarUrl !== 'string') return res.status(400).json({ message: 'avatarUrl required' });

        // In production, validate/upload to Cloudinary and use returned URL.
        user.avatar = avatarUrl;
        user.updatedAt = Date.now();
        const updated = await user.save();
        res.json(sanitize(updated));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload avatar file (multer memory buffer) to Cloudinary
exports.uploadAvatarFile = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const bufferStream = streamifier.createReadStream(req.file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'avatars', resource_type: 'image' }, async (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Cloudinary upload error', error });
            }
            user.avatar = result.secure_url;
            user.updatedAt = Date.now();
            const updated = await user.save();
            res.json(sanitize(updated));
        });
bufferStream.pipe(uploadStream);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
