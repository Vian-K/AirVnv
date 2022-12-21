const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');


router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll()
    res.json(spots)

})





module.exports = router;
