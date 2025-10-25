const mongoose = require('mongoose');

// Simple activity log schema
// Use this collection for security/audit events like login attempts, successes, failures, etc.
const LogSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
		email: { type: String, index: true },
		action: {
			type: String,
			required: true,
			enum: [
				'login_attempt',
				'login_success',
				'login_failure',
				'login_blocked',
				'logout',
				'profile_update',
				'avatar_upload',
			],
		},
		ip: { type: String, index: true },
		userAgent: { type: String },
		success: { type: Boolean, default: false, index: true },
		meta: { type: mongoose.Schema.Types.Mixed },
		createdAt: { type: Date, default: Date.now, index: true },
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

// Compound index to speed rate-limit queries
LogSchema.index({ email: 1, ip: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('Log', LogSchema);

