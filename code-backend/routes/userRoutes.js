const { Router } = require('express');
const users = require('../models/users.js');
const { body, validationResult } = require('express-validator');

const router = Router();


// Validation middleware array
const validateEmail = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail()
];
const validatePassword = [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// I know that I could combine the two but it this way it removes copied code.
router.post('/register', validateEmail, validatePassword, users.register);
router.post('/login', validateEmail, validatePassword, users.login);
router.patch('/update', users.updateUser);
router.patch('/reset', validatePassword, users.resetPassword);
router.get('/logout', users.logout);

router.get('/bookmarks/:user_id', users.items_bookmarks);
router.get('/items/:user_id', users.items);
router.post('/items/:user_id', users.items_add);
router.patch('/items/:user_id', users.items_comment);
router.delete('/items/:user_id', users.items_delete);


module.exports = router;