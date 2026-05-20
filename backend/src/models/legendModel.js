const mongoose = require('../db');

const legendSchema = new mongoose.Schema({
  model: String,
  rows: Number,
  cols: Number,
  oa: String,
  instructions: String,
  data: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Legend', legendSchema);