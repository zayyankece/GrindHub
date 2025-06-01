require('dotenv').config();          
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 

const app = express();

app.use(cors({
  origin: '*'  
}));
app.use(express.json());             

// Routes prefix
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
