'use strict';

require('./db');
const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('✅ MongoDB Connected');
});