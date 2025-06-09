const express = require('express');
const router = express.Router();
const db = require('../models/db');
const path = require('path');


router.get('/', (req, res) => {
    res.send("Rota Funcionando!")
});

module.exports = router;