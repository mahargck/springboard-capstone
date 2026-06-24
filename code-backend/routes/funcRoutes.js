const { Router } = require('express');
const func = require('../models/func.js');

const router = Router();

router.get('/zip_code/:zip_code', func.zipcode);

module.exports = router;