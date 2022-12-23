const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');


router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user
    const bookings = await Booking.findByPk(user.id)

    res.json(bookings)
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingId
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

    await bookings.destroy()
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params

    const bookings = await Booking.findByPk(bookingId)
    const { startDate, endDate } = req.body

    bookings.startDate = startDate
    bookings.endDate = endDate
    res.json(bookings)
})

module.exports = router;
