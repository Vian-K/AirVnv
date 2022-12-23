const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');


router.get('/reviews/current', requireAuth, async (req, res, next) => {
    const user = req.user
    const reviews = await Spot.findAll({
        where: {
            ownerid: user.id
        },
        include: [
            {
                model: Review
            }
        ]
    })
    res.json(reviews)
})

router.post('/spots/:spotId/reviews', requireAuth, async (req,res,next) => {
    const id = req.user.id
    const { review, stars } = req.body
    const reviews = await Review.create({
        ownerId: id,
        review,
        stars
    })
    res.json(reviews)
})
