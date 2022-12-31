const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');
const { Op } = require('sequelize')

router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: ["ownerId", "address", "city",
                "state", "country", "lat", "lng", "name", "price"
            ]
            },
        ]
    })

    if (Array.isArray(bookings) && bookings.length === 0) {
        const err = new Error('You currently do not have any bookings')
        err.title = 'Booking does not exist'
        err.status = 404
        err.error = [{
            message: "You currently do not have any bookings",
            statusCode: 404
        }]
        return next(err)
    }
    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage
            }
        ],
    })
    if(!spots) {
        const err = new Error('Spots does not exist')
        err.title = 'Spots couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Spots couldn't be found",
            statusCode: 404
        }]
        console.log(err)
        return next(err)
    }
    let payload = []
    spots.forEach(spot => {
        payload.push(spot.toJSON())
    })
    for(let i = 0; i < payload.length; i++) {
        let spot = payload[i]
        spot.SpotImages.forEach(image => {
            if(image.preview === true) {
                bookings.forEach(booking => {
                    booking.Spot.dataValues.previewImage = image.url
                })
            }
        })
    }
    res.json({bookings})
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingId
    const startDate = new Date().toISOString().slice(0,10)
    const bookings = await Booking.findByPk(id)
    if(!bookings) {
        const err = new Error('Booking does not exist')
        err.title = 'Booking couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Booking couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
    if(req.user.id !== bookings.userId) {
        const err = new Error('Authorization required')
        err.title = 'Authorization required'
        err.status = 403;
        return next(err)
    }
    if(bookings.dataValues.startDate <= startDate) {
        const err = new Error('Bookings that have been started can\'t be deleted')
            err.title = 'Bookings that have been started can\'t be deleted'
            err.status = 403
            err.error = [{
                message: "Bookings that have been started can't be deleted",
                statusCode: 403
            }]
            return next(err)
    }
    await bookings.destroy()
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const userId = req.user.id
    const { startDate, endDate} = req.body

    const newStartDate = new Date(startDate).toISOString().slice(0,10)
    const newEndDate = new Date(endDate).toISOString().slice(0,10)
    
    const bookings = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if(!bookings) {
        const err = new Error('Booking does not exist')
        err.title = 'Booking couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Booking couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }

    if(bookings.userId !== userId) {
        const err = new Error('Validation Error')
        err.title = 'You are not authorized to edit this booking'
        err.status = 403;
        err.error =[{
            message: "You are not authorized to edit this booking",
            statusCode: 403
        }]
        return next(err)
    }

    if(newEndDate <= newStartDate) {
        const err = new Error('Validation Error')
        err.title = 'endDate cannot be on or before startDate'
        err.status = 400;
        err.error =[{
            endDate: "endDate cannot be on or before startDate"
        }]
        return next(err)
    }

    const conflictingBookings = await Booking.findAll({
        where: {
            spotId: bookings.spotId,
            userId: {
                [Op.ne]: userId
            },
            [Op.or]: [
              {
                startDate: {
                  [Op.lt]: newEndDate,
                },
                endDate: {
                  [Op.gt]: newStartDate,
                },
              },
              {
                startDate: {
                  [Op.gt]: newStartDate,
                },
                endDate: {
                  [Op.lt]: newEndDate,
                },
              },
              {
                startDate: {
                  [Op.lt]: newStartDate,
                },
                endDate: {
                  [Op.gt]: newEndDate,
                },
            },
            ],
        }
    });

    let conflict = false;
    conflictingBookings.forEach(cbooking => {
        if ((newStartDate >= cbooking.startDate && newStartDate < cbooking.endDate) ||
        (newEndDate > cbooking.startDate && newEndDate <= cbooking.endDate) ||
        (newStartDate <= cbooking.startDate && newEndDate >= cbooking.endDate)) {
            conflict = true
        }
    })

if(conflict === true) {
        const err = new Error('Validation Error')
        err.title = 'Sorry, this spot is already booked for the specified dates'
        err.status = 403;
        err.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }
        return next(err)
    }

    if(bookings.dataValues.endDate <= endDate) {
        const err = new Error('Past bookings can\'t be modified')
            err.title = 'Past bookings can\'t be modified'
            err.status = 403
            err.error = [{
                message: "Past bookings can\'t be modified",
                statusCode: 403
            }]
            return next(err)
    }

    bookings.startDate = startDate
    bookings.endDate = endDate

    await bookings.save()
    res.json(bookings)
})




module.exports = router;
