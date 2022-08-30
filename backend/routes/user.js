const express = require('express');
const router = express.Router();

// importation controllers/user.js
const userCtrl = require('../controllers/user');

// importation middleware/password
const password = require('../middleware/password');

// importation midlleware/email
const email = require('../middleware/email');

router.post('/signup', password, email, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;