const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');
const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        // .notEmpty()
        .isLength({max: 50})
        .withMessage('Name cannot be longer than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Price per day is required'),
    handleValidationErrors

]


router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],

    })
    let payload = []

    spots.forEach(spot => {
        payload.push(spot.toJSON())
    })

    for(let i = 0; i < payload.length; i++) {
        let spot = payload[i]

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                include: [
                    [sequelize.fn("AVG", sequelize.col('stars')),"avgRating"]
                ]
            },
            // group: ['Review.Id']
        })

        spot.avgRating = reviews[0].dataValues.avgRating
        spot.SpotImages.forEach(image => {
            if(image.preview === true) {
                spot.previewImage = image.url
            }
        })

        if(!spots.previewImage) {
            spots.previewImage = 'no image found'
        }
        if(!spot.avgRating) {
            spot.avgRating = 'No reviews'
        }
        delete spot.SpotImages
        delete spot.Reviews
    }

res.json({Spots: payload})

})
router.post('/:spotId/reviews', requireAuth, async (req,res,next) => {
    const { spotId } = req.params
    const userId = req.user.id
    const { review, stars } = req.body
    const spot = await Spot.findByPk(spotId)
    if(!spot) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
    const reviewCheck = await Review.findAll()
        reviewCheck.forEach(review => {
            if(review.dataValues.userId === userId){
                const err = new Error('User already has a review for this spot')

        err.title = 'User already has a review for this spot'
        err.status = 403;
        err.errors = [{
            message: "User already has a review for this spot",
            statusCode: 403
        }]
        return next(err)
            }
        })
    const reviews = await Review.create({
        userId: userId,
        spotId,
        review,
        stars
    })
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
    res.json(reviews)


})
// ASK IF SPOT DATA IS REQUIRED TO BE REMOVED
router.get('/:spotId/reviews', async (req,res, next)=> {
    const { spotId } = req.params


    const spot = await Spot.findByPk(spotId)

    if(!spot) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
    const reviews = await Spot.findAll({
        where: {
            id: spotId
        },

        include: [{
            model: Review,
            include: [
            {
                model: User,
                attributes: ["id", 'firstName', 'lastName'],
                as: "User"
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
            ]
        }]
    })

    res.json({
        reviews
    })
})
router.post("/", requireAuth, validateSpot, async (req,res,next) => {
    const id = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spots = await Spot.create({
       ownerId: id,
       address, city, state, country, lat, lng, name, description, price})

    res.json(spots)
})

router.delete('/:spotId', requireAuth, async(req,res,next) => {
    const id = req.params.spotId
    const spots = await Spot.findByPk(id)
    if(!spots) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        return next(err)

    }
    await spots.destroy()

    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

router.get('/current', requireAuth, async(req, res, next) => {
    const user = req.user
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],

    })
    let payload = []

    spots.forEach(spot => {
        payload.push(spot.toJSON())
    })

    for(let i = 0; i < payload.length; i++) {
        let spot = payload[i]

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                include: [
                    [sequelize.fn("AVG", sequelize.col('stars')),"avgRating"]
                ]
            },
            // group: ['Review.Id']
        })

        spot.avgRating = reviews[0].dataValues.avgRating

        spot.SpotImages.forEach(image => {
            if(image.preview === true) {
                spot.previewImage = image.url
            }
        })

        if(!spots.previewImage) {
            spots.previewImage = 'no image found'
        }
        if(!spot.avgRating) {
            spot.avgRating = 'No reviews'
        }
        delete spot.SpotImages
        delete spot.Reviews
    }

res.json({Spots: payload})

})

router.get('/:spotId', async(req,res, next) => {
    const spots = await Spot.findByPk(req.params.spotId, {
        raw: true,
    })
    const reviews = await Review.findAll({
        where: {
            spotId: spots.id
        },
            attributes: ["stars", "review"],
            raw: true

    })
    let count = 0;
    let total = reviews.length;
    reviews.forEach(rating => {
        count += rating.stars
    })

    spots.numReviews = reviews.length;
    spots.avgStarRating = count / total

    const image = await SpotImage.findAll({
        where: {
            preview: true,
            spotId: spots.id,
        },
        attributes: ['id', 'url', 'preview']
    })
    spots.SpotImages = image;

    const owner = await User.findOne({
        where: {
                id: spots.ownerId
        },
        attributes: ['id', 'firstName', 'lastName']
    })
    spots.Owner = owner

    if(!spots) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    res.json(spots)

})

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const id = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spots = await Spot.findOne({
        where: {
            ownerId: id
        }
    })
    spots.address = address
    spots.city = city
    spots.state = state
    spots.country = country
    spots.lat = lat
    spots.lng = lng
    spots.name = name
    spots.description =description
    spots.price = price

    await spots.save()

    if(!spots) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        return next(err)

    }
    return res.json(spots)
})

router.post('/:spotId/images', requireAuth, async (req,res,next) => {
    const { spotId } = req.params
    const { url, preview } = req.body
    const spot = await Spot.findByPk(spotId)

    if(!spot) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
    const spotimage = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    })
    res.json({
        id: spotimage.id,
        url: spotimage.url,
        preview: spotimage.preview
    })
})

router.get('/:spotId/bookings', requireAuth, async (req,res,next) => {
    const { spotId } = req.params
    const userId = req.user.id


    const spot = await Spot.findOne({
        where: { id: spotId }
    })


    if (spot.ownerId === userId) {

        const ownerBookings = await Booking.findAll({
            include: [{model: User,
                attributes: ["id", "firstName", "lastName"]
            }],

            where: {
                spotId: spotId
            },
        })
        return res.json({ownerBookings})
    } else {
       
        const userBookings = await Booking.findAll({
            where: {
                spotId: spotId,
                userId: userId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.json({userBookings})
    }
})

router.post('/:spotId/bookings', requireAuth, async (req,res,next) => {
    const user = req.user

    const { userId } = req.user.id
    const { spotId } = req.params
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId)
    const bookings = await Booking.findByPk(spotId)

    const newStartDate = new Date(startDate).toISOString().slice(0,10)
    const newEndDate = new Date(endDate).toISOString().slice(0,10)
console.log(newStartDate)
    console.log(newEndDate)
    if(!spot) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    if(newEndDate === newStartDate) {
        const err = new Error('Validation Error')
        err.title = 'endDate cannot be on or before startDate'
        err.status = 400;
        err.error =[{
            endDate: "endDate cannot be on or before startDate"
        }]
    }
    const addbookings = await Booking.create({
        spotId: spotId,
        userId: user.id,
        startDate: newStartDate,
        endDate: newEndDate
    })

res.json(addbookings)
})





module.exports = router;
