'use strict';

const mongoose = require('mongoose');
const app = require('./app');

const PORT = 5000;

// Start server immediately — don't wait for or crash on DB connection
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB separately; log errors but keep server alive
mongoose.connect('mongodb+srv://mailchinmayee4_db:YrTODdXt5z6HLIrZ@cluster0.lbk0b1x.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('⚠️  MongoDB connection failed (history features unavailable):', err.message));