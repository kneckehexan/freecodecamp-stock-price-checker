'use strict';

const express = require('express')
const router = express.Router();

const {getStock} = require('../controllers/stock');

router.route('/').get(getStock);

module.exports = router;
