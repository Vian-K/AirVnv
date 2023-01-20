
import { csrfFetch } from "./csrf";

const LOAD_REVIEW = 'reviews/loadReview'
const ADD_REVIEW = 'reviews/addReview'
const ADD_IMAGE = 'review/addImage'
// const EDIT_REVIEW = 'spots/editSpots'
const DELETE_REVIEW = 'review/deleteSpots'
// const LOAD_ONE_SPOT = 'spots/loadOneSpot'

export const loadReviews = (reviews) => ({
    type: LOAD_REVIEW,
    payload: reviews
})
export const addReview = (reviews) => ({
    type: ADD_REVIEW,
    payload: reviews
})
export const deleteReview = (reviews) => ({
    type: DELETE_REVIEW,
    payload: reviews
})

export const getReviews = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}/reviews`)
    const data = await response.json()
    dispatch(loadReviews(data))
    return response
}

export const addReviews = (spot) => async (dispatch) => {
    console.log("spot", spot)
    const response = await csrfFetch(`api/spots/${spot.id}/reviews`, {
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
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',

    })
    if(response.ok) {
        const data = await response.json()
        dispatch(deleteReview(data))
        return response
    }
}

export const reviewsReducer = (state = {}, action) => {
    let newState;
    switch(action.type) {
        case LOAD_REVIEW:
            newState = {...state}
            newState = action.payload
            return newState
        case ADD_REVIEW:
            newState = {...state}
            let newStateCopy = {}
            newState[action.payload.id] = action.payload
            newState = newStateCopy
            return newState
        case DELETE_REVIEW:
            newState = {...state}
            newState = action.payload
            let deleteStateCopy = {...newState}
            delete deleteStateCopy.newState
            return newState

        default:
            return state

    }
}
