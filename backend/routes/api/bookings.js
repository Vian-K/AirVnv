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
    const spots = await Spot.findAll({
        include: [
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
        spot.SpotImages.forEach(image => {
            if(image.preview === true) {
                bookings.forEach(booking => {
                    booking.Spot.dataValues.previewImage = image.url
                })
            }
        })
    }
    res.json(bookings)
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
// COME BACK FOR user being able to edit other users booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params
    const id = req.user.id
    const { startDate, endDate} = req.body

    const newStartDate = new Date(startDate).toISOString().slice(0,10)
    const newEndDate = new Date(endDate).toISOString().slice(0,10)

    const allBooking = await Booking.findAll()
    let spotId = null
    let userID = null
    allBooking.forEach(booking => {
       spotId = booking.dataValues.spotId
       userID = booking.dataValues.userId

    })

    const bookings = await Booking.findOne({
        where: {
            userId: id
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
    if(newEndDate <= newStartDate) {
        const err = new Error('Validation Error')
        err.title = 'endDate cannot be on or before startDate'
        err.status = 400;
        err.error =[{
            endDate: "endDate cannot be on or before startDate"
        }]
        return next(err)
    }
if(id !== userID) {
    const conflictingBookings = await Booking.findAll({
        where: {
            spotId: spotId,
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
}

console.log(id)
console.log(userID)
if(id !== userID) {
    throw new Error("This booking is not available to edit by you")

} else {
    bookings.startDate = startDate
    bookings.endDate = endDate
}

await bookings.save()
    res.json(bookings)
})




module.exports = router;
