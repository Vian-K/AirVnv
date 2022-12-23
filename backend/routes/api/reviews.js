const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const user = req.user
    const { reviewId } = req.params
    const { url } = req.body
    const review = await Review.findByPk(reviewId)
   for (let i = 0; i < review.ReviewImage; i++) {
        let each = review.ReviewImage[i]
        console.log(each)
   }
    if(!review) {
        const err = new Error('Review does not exist')
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Review couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    const reviewimage = await ReviewImage.create({
        reviewId: reviewId,
        url
    })
    console.log(reviewimage)
res.json({
    id: reviewimage.id,
    url: reviewimage.url
})
})
router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user
    const reviews = await Spot.findOne({
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

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const id = req.params.reviewId
    const reviews = await Review.findByPk(id)
    console.log(reviews)
    if(!reviews) {
        const err = new Error('Review does not exist')
        err.title = 'Review couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Review couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    await reviews.destroy()
    res.json ({
        message: "Successfully deleted",
        statusCode: 200
    })
})
module.exports = router;
