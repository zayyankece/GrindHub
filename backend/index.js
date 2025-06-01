require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes'); 
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://192.168.1.6:8081', 'exp://192.168.1.6:8081']
}));

app.use(express.json());

// Register the route
app.use('/api/auth', authRoutes); // <<--- mount the router here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
