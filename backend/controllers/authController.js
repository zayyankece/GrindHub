const db = require('../db.js');  // Import your db.js file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' , result:result});
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials (beda pass)', result:result, pass:password, userpass:user.password });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'Login success!', token });
  } catch (err) {
    console.error('Login error:', err);  // <-- Log full error here
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' , success : false});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const newUser = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0], success : true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', success : false});
  }
};