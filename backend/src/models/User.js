const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For your demo, use plain text or bcrypt
  name: String
});

module.exports = mongoose.model('User', userSchema);