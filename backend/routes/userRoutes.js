const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { register, login } = require('../controllers/authController');
const { addSkill, getStudentsBySkill, getAllStudents } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.post('/skills', auth, addSkill);
router.get('/students', getAllStudents);
router.get('/students/search', getStudentsBySkill);

module.exports = router;
