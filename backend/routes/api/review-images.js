const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');


router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { imageId } = req.params
    const images = await ReviewImage.findByPk(imageId)
    console.log(images)
    if(!images) {
        const err = new Error('Image does not exist')
        err.title = 'Image couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Image couldn't be found",
            statusCode: 404
        }]
        return next(err)
       }
    const reviews = await Review.findOne({
        where: {
            id: images.reviewId

        }
    })

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
   if(req.user.id !== reviews.userId) {
    const err = new Error('Authorization required')
    err.title = 'Authorization required'
    err.status = 403;
    return next(err)
}
   await images.destroy()
   res.json(({
        message: "Successfully deleted",
        statusCode: 200
   }))
})

module.exports = router;
