const express = require('express');
const authRoutes = require('./routes/authRoutes'); // <<--- path must be correct!
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Register the route
app.use('/api/auth', authRoutes); // <<--- mount the router here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
