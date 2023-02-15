

import csrfFetch from "./csrf"

const LOAD_BOOKINGS = 'bookings/loadBookings'
const LOAD_USER_BOOKINGS = 'bookings/loadUserBookings'
const ADD_BOOKINGS = 'bookings/addBookings'
const EDIT_BOOKINGS = 'bookings/editBookings'
const DELETE_BOOKINGS = 'bookings/deleteBookings'

export const loadBooking = (bookings) => ({
    type: LOAD_BOOKINGS,
    payload: bookings
})
export const addBooking = (bookings) => ({
    type: ADD_BOOKINGS,
    payload: bookings
})
export const editBooking = (bookings) => ({
    type: EDIT_BOOKINGS,
    payload: bookings
})
export const deleteBooking = (bookings) => ({
    type: DELETE_BOOKINGS,
    payload: bookings
})

export const loadUserBooking = (bookings) => ({
    type: LOAD_USER_BOOKINGS,
    payload: bookings
})

export const getBookings = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/bookings`)
    const data = await response.json()
    dispatch(loadBooking(data))
    return data
}

export const getUserBookings = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`)
    const data = await response.json()
    dispatch(loadUserBooking(data))
    return data
}

export const addBookings = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${booking.id}/bookings`, {
        method: 'POST',
        body: JSON.stringify(booking)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(addBooking(data))
        return data

    }
}
export const editBookings = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${booking}`, {
        method: 'PUT',
        body: JSON.stringify(booking)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(editBooking(data))
        return data

    }
}

export const deleteBookings = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE'
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(deleteBooking(booking.id))
        return response
    }
}

const initialState = {allBookings: {},  userSpecificBookings: {} }

export const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_BOOKINGS:
            newState = {...state}
            // console.log('NEWSTATE', newState)
            let allBookingsCopy = {}
            action.payload.Bookings.forEach(booking => {
                allBookingsCopy[booking.id] = booking
            })
            newState.allBookings = allBookingsCopy
            return newState;

        case LOAD_USER_BOOKINGS:
            newState = {...state}
            let userSpecificBookingsCopy = {}
           
            action.payload.bookings.forEach(booking => {
                userSpecificBookingsCopy[booking.id] = booking
            })
            newState.userSpecificBookings = userSpecificBookingsCopy
            return newState
        case ADD_BOOKINGS:
            newState = {...state}
            let newStateCopy = {...newState.allBookings}
            newStateCopy[action.payload.id] = action.payload
            newState.allBookings = newStateCopy
            return newState;
        default:
            return state;
    }
}

export default bookingsReducer;
