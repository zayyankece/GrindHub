require('dotenv').config();          // Load .env variables
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');  // Your auth routes file

const app = express();

app.use(cors({
  origin: '*'  // Change this to your frontend URL or '*' for testing
}));
app.use(express.json());             // Parse JSON request bodies

// Routes prefix
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
