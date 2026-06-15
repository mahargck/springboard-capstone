const { Router } = require('express');
const users = require('../models/users.js');
const { body, validationResult } = require('express-validator');

const router = Router();


// Validation middleware array
const validateUserNewReset = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
const validateUserPassword = [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];


router.post('/create', validateUserNewReset, users.create);
router.post('/login', validateUserNewReset, users.login);
router.post('/update', users.updateUser);
router.post('/reset', validateUserPassword, users.resetPassword);
router.get('/logout', users.logout);
// router.get('/register', users.register);

router.get('/bookmarks/:user_id', users.items_bookmarks);
router.get('/items/:user_id', users.items);
router.post('/items/:user_id', users.items_add);
router.patch('/items/:user_id', users.items_comment);
router.delete('/items/:user_id', users.items_delete);


module.exports = router;