const express = require('express');
const router = express.Router();
const { signup, login, getAssignments, getClass, getUser} = require('../controllers/authController');
// , setAssignments,setClass,getClass,setModule,getModule,setChats,getChats,setGroups,getGroups,setUsers,getUsers
router.post('/signup', signup);
router.post('/login', login);
router.post('/getAssignments', getAssignments)
// router.post('/setAssignments', setAssignments)
// router.post('/setClass', setClass)
router.post('/getClass', getClass)
// router.post('/setModule', setModule)
// router.post('/getModule', getModule)
// router.post('/setChats', setChats)
// router.post('/getChats', getChats)
// router.post('/setGroups', setGroups)
// router.post('/getGroups', getGroups)
// router.post('/setUsers', setUsers)
router.post('/getUser', getUser)

module.exports = router;
