const db = require('../db.js');
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

exports.updateUser = async(req, res) => {
  const { username, field, value } = req.body;
  const columnMap = {
    notifications: 'isnotificationon',
    taskDeadline: 'istaskdeadlinenotificationon',
    lectureClass: 'islecturenotificationon',
    groupMessages: 'isgroupmessagesnotificationon',
    privateMessages: 'isprivatemessagesnotificationon',
  };

  const dbColumn = columnMap[field];

  // If the provided field is not in our map, reject the request.
  if (!dbColumn) {
    return res.status(400).json({ success: false, message: 'Invalid notification field.' });
  }

  try {
    // We can now safely build the query. The column name is from our secure whitelist,
    // and the values are passed as parameters to prevent SQL injection.
    const query = `UPDATE userprofile SET ${dbColumn} = $1 WHERE username = $2::text RETURNING *`;
    
    const { rows } = await db.query(query, [value, username]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'Notification setting updated.', user: rows[0] });

  } catch (error) {
    console.error('Error updating notification setting:', error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }
}

exports.getGroups = async(req, res) => {
  const {userid} = req.body

  try{
    const existingGroups = await db.query('SELECT gc.groupid, gc.groupname FROM groupmembers gm JOIN groupcollections gc ON gm.groupid::integer = gc.groupid WHERE gm.userid = $1', [userid])
    if (existingGroups.rows.length == 0){
      return res.status(404).json({message: "No groups found!", success: false})
    }
    return res.status(200).json({message: "Group retrieved!", success:true, groups:existingGroups.rows})
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', success : false});
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

exports.getDescription = async (req, res) => {
  const {groupid} = req.body

  try{
    const queryText = "SELECT gm.userid, gc.groupdescription, gc.groupname FROM groupcollections gc JOIN groupmembers gm ON gm.groupid::integer = gc.groupid WHERE gm.groupid = $1"
    const existingDescription = await db.query(queryText, [groupid])
    if (existingDescription.rows.length == 0){
      return res.status(404).json({message: "No description found!", success: false, description:existingDescription})
    }
    return res.status(200).json({message: "Description retrieved!", success:true, description:existingDescription.rows})
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