const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');
const { SpotImage } = require('../../db/models')
const { User } = require('../../db/models')

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll()
    res.json(spots)

})
router.get('/current', requireAuth, async(req, res, next) => {
    const spots = await Spot.findOne(req.params.id)
    res.json(spots)
})

router.get('/:spotId', async(req,res, next) => {

    const spots = await Spot.findByPk(req.params.spotId, {
        include: [
        {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: User,
            attributes: ["id", "firstName", "lastName"],
            as: "Owner"
        }
        ]
    })
    if(!spots) {
        res.status(404)
        res.json({
            message: "Couldn't find a Spot with the specified id"
        })
    } else {
    res.json(spots)
    }
})






module.exports = router;
