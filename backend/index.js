require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes'); 
const PORT = 3000;

app.use(cors({
  origin: ['http://192.168.1.6:8081', 'exp://192.168.1.6:8081']
}));

app.use(express.json());

// app.post('/api/auth/login', (req, res) => {
//   console.log('Received login:', req.body);
//   const { email, password } = req.body;
  
//   if (email === 'test@example.com' && password === '123456') {
//     return res.json({ success: true, message: 'Login success!' });
//   } else {
//     return res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// Register the route
app.use('/api/auth', authRoutes); // <<--- mount the router here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
