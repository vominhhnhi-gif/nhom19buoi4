const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RefreshToken', RefreshSchema);