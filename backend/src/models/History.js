const mongoose = require('mongoose');

/**
 * History Schema for Minilec Legend Printing System
 * model: Stores OA Number for table display consistency
 * legendsInfo: Stores user instructions/PTS info
 */
const historySchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  model: { 
    type: String, 
    required: false,
    description: "Mapped to OA Number for legacy table support" 
  },
  oaNumber: { 
    type: String, 
    required: true 
  },
  legendsInfo: { 
    type: String, 
    required: false,
    description: "Stores the instructions/notes for the label set"
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  approvedBy: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model('History', historySchema);