const express = require('express');
const { register, login } = require('../controllers/authController');
const cors = require('cors');

const router = express.Router();

router.post('/register', cors(), register);
router.post('/login', cors(), login);

module.exports = router;