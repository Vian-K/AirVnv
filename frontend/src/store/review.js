
import { csrfFetch } from "./csrf";

const LOAD_REVIEW = 'reviews/loadReview'
const LOAD_USER_REVIEW = 'reviews/loadUserReview'
const ADD_REVIEW = 'reviews/addReview'

// const EDIT_REVIEW = 'spots/editSpots'
const DELETE_REVIEW = 'review/deleteReview'


export const loadReviews = (reviews) => ({
    type: LOAD_REVIEW,
    payload: reviews
})
export const loadUserReview = (reviews) => ({
    type: LOAD_USER_REVIEW,
    payload: reviews
})
export const addReview = (reviews) => ({
    type: ADD_REVIEW,
    payload: reviews
})
export const deleteReview = (reviews) => ({
    type: DELETE_REVIEW,
    payload: reviews,

})

export const getReviews = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot}/reviews`)
    const data = await response.json()
    dispatch(loadReviews(data))
    return data
}

export const getUserReviews = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`)
    const data = await response.json()
    dispatch(loadUserReview(data))
    return data
}


export const addReviews = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(spot)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(addReview(data))
        return data
    }
}

export const deleteReviews = (review) => async (dispatch) => {
        // console.log("deleteReview", review)
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
        body: JSON.stringify(review)

    })
    if(response.ok) {
        const data = await response.json()
        console.log("response data", data)
        dispatch(deleteReview(review))
        return response
    }
}
const initialState = { allReviews: {}, userSpecificReviews: {}}

export const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_REVIEW:
            newState = {...state}
            let reviewsCopy = {}
            // console.log("action.payload.loadreview", action.payload)
        action.payload.Reviews.forEach(review => {
            reviewsCopy[review.id] = review
        })
        newState.allReviews = reviewsCopy

            return newState
         case LOAD_USER_REVIEW:
            newState = {...state}
            let userSpecificReviewsCopy ={}
            action.payload.Reviews.forEach(review => {
                userSpecificReviewsCopy[review.id] = review
            })
            newState.userSpecificReviews = userSpecificReviewsCopy
            return newState
        case ADD_REVIEW:
            newState = {...state}
            let newStateCopy = {...newState.allReviews}
            newStateCopy[action.payload.id] = action.payload
            newState.allReviews = newStateCopy
            return newState
        case DELETE_REVIEW:
           newState= {...state}
           let reviewCopy = {...newState.userSpecificReviews}
           delete reviewCopy[action.payload.id]
           newState.userSpecificReviews = reviewCopy
            return newState

        default:
            return state

    }
}
export default reviewsReducer
