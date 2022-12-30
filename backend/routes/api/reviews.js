const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');



router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    // const user = req.user
    const { reviewId } = req.params
    const { url } = req.body
    const reviewimage = await ReviewImage.create({
        reviewId: reviewId,
        url
    })
    const review = await Review.findByPk(reviewId)
    const reviewimage2 = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })


    if(reviewimage2.length > 10) {
        const err = new Error('Maximum number of images for this resource was reached')
        err.title = 'Maximum number of images for this resource was reached'
        err.status = 403;
        err.errors = [{
            message: "Maximum number of images for this resource was reached",
            statusCode: 404
        }]
        return next(err)
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

res.json({
    id: reviewimage.id,
    url: reviewimage.url
})

})
// BODY MISSING REVIEWIMAGE SHOWING EMPTY ARRAY []
// BODY MISSING previewImage FOR SPOTS
router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        group: ["Spot.Id", "Reviews.id", "SpotImages.id"]

    })
    let payload = []
    spots.forEach(spot => {
        payload.push(spot.toJSON())
    })
    for(let i = 0; i < payload.length; i++) {
        let spot = payload[i]
    spot.SpotImages.forEach(image => {
        if(image.preview === true) {
            spot.previewImage = image.url
        }
    })

    if(!spots.previewImage) {
        spots.previewImage = 'no image found'
    }

}
    const reviews = await Review.findOne({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ["id", 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes:
                    ['id', "ownerId", 'address','city', 'state', 'country',
                    'lat', 'lng', 'name', 'price']

            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }

        ]
    })


    if(!reviews) {
        const err = new Error('Review does not exist')
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Review couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    res.json(reviews)
})

router.put('/:reviewId', requireAuth,  async (req,res, next) => {

    const { reviewId } = req.params

    const { review, stars } = req.body

    const reviews = await Review.findByPk(reviewId)

    if(!reviews) {
        const err = new Error('Review does not exist')
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        return next(err)

    }
    if(!review) {
        const err = new Error('Validation Error')
        err.title = "Validation error"
        err.status = 400;
        err.errors = [{
            message: 'Review text is required',
        }]
        return next(err)
    }
        if(isNaN(stars) || stars < 1 || stars > 5) {
            const err = new Error('Validation Error')
            err.title = "Validation error"
            err.status = 400;
            err.errors = [{

                message: 'Stars must be an integer from 1 to 5'
            }]
            return next(err)
        }
    reviews.review = review
    reviews.stars = stars
    await reviews.save()
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
