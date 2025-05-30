const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === '123456') {
    res.json({ success: true, message: 'Login success!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};



// exports.signup = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Insert new user
//     const newUser = await pool.query(
//       'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
//       [email, hashedPassword]
//     );

//     res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ message: 'User does not exist' });
//     }

//     const validPassword = await bcrypt.compare(password, user.rows[0].password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ user: { id: user.rows[0].id, email: user.rows[0].email }, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };
