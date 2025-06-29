const db = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/authRoutes.js');
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
      return res.status(401).json({ success: false, message: 'Invalid credentials (beda pass)', result:result });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'Login success!', token });
  } catch (err) {
    console.error('Login error:', err);  
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' , success : false});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

exports.getAssignments = async(req, res) => {
  const {userid} = req.body

  try{
    const existingAssignment = await db.query('SELECT * FROM assignments WHERE userid = $1', [userid])
    if (existingAssignment.rows.length == 0){
      return res.status(404).json({message: "No assignment found!", success: false})
    }
    return res.status(200).json({message: "Assignments retrieved!", success:true, assignments:existingAssignment.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false});
  }

}

exports.getClass = async(req, res) => {
  const {userid} = req.body

  try{
    const existingClass = await db.query('SELECT * FROM class WHERE userid = $1', [userid])
    if (existingClass.rows.length == 0){
      return res.status(404).json({message: "No class found!", success: false})
    }
    return res.status(200).json({message: "Class retrieved!", success:true, classes:existingClass.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false});
  }

}

exports.getUser = async(req, res) => {
  const {username} = req.body

  try{
    const existingUser = await db.query('SELECT * FROM userprofile WHERE username = $1', [username])
    if (existingUser.rows.length == 0){
      return res.status(404).json({message: "No user found!", success: false})
    }
    return res.status(200).json({message: "User retrieved!", success:true, existingUser:existingUser.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false});
  }
}

exports.getGroups = async(req, res) => {
  const {userid} = req.body

  console.log(typeof userid)
  console.log(userid)

  try{
    const existingGroups = await db.query(`SELECT gc.groupid, gc.groupname FROM groupmembers gm JOIN groupcollections gc ON gm.groupid = gc.groupid WHERE gm.userid = '${userid}'`)
    if (existingGroups.rows.length == 0){
      return res.status(404).json({message: "No groups found!", success: false})
    }
    return res.status(200).json({message: "Group retrieved!", success:true, groups:existingGroups.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false, errormessage:error});
  }
}

exports.getMessages = async(req, res) => {
  const {groupid} = req.body

  try{
    const queryText = "SELECT m.messageid, m.messagecontent, m.timestamp, u.userid, u.username FROM messagecollections m JOIN userprofile u ON m.userid = u.username WHERE m.groupid = $1 ORDER BY m.timestamp ASC;"
    const existingMessages = await db.query(queryText, [groupid])
    if (existingMessages.rows.length == 0){
      return res.status(404).json({message: "No messages found!", success: false, messages:existingMessages, gi:groupid})
    }
    return res.status(200).json({message: "Messages retrieved!", success:true, messages:existingMessages.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false});
  }
}


// exports.setAssignments

// exports.setClass

// exports.setModule
// exports.getModule

// exports.setChats
// exports.getChats

// exports.setGroups
// exports.getGroups

// exports.setUsers