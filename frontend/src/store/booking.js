

import csrfFetch from "./csrf"

const LOAD_BOOKINGS = 'bookings/loadBookings'
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

export const getBookings = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/bookings`)
    const data = await response.json()
    dispatch(loadBooking(data))
    return data
}

export const addBookings = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}/bookings`, {
        method: 'POST',
        body: JSON.stringify(spot)
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

const initialState = {allBookings: {}, /* userSpecificBookings: {} */}

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
        default:
            return state;
    }
}

export default bookingsReducer;
