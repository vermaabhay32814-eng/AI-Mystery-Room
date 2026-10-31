'use strict';

const express = require('express');
const router = express.Router();
const { register, login, getMe, getMyCases } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const { requireAuth } = require('../middleware/auth');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', requireAuth, getMe);
router.get('/my-cases', requireAuth, getMyCases);

module.exports = router;

