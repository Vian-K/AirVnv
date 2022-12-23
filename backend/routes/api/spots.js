const express = require('express')
const { User, Spot, SpotImage, Review, sequelize } = require('../../db/models')
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
            group: ['Review.id']
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
            group: ['Review.id']
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
        include: [
        {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: User,
            attributes: ["id", "firstName", "lastName"],
            as: "Owner"
        },

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


module.exports = router;
