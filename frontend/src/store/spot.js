
import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots'
const ADD_SPOTS = 'spots/addSpots'
const ADD_IMAGE = 'spots/addImage'
const EDIT_SPOTS = 'spots/editSpots'
const DELETE_SPOTS = 'spots/deleteSpots'
const LOAD_ONE_SPOT = 'spots/loadOneSpot'

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
})

export const loadOneSpot = (spots) => ({
    type: LOAD_ONE_SPOT,
    payload: spots
})

export const createSpots = (spots) => ({
    type: ADD_SPOTS,
    payload: spots
})

export const editSpots = (spots) => ({
    type: EDIT_SPOTS,
    payload: spots
})

export const addImages = (spots) => ({
    type: ADD_IMAGE,
    payload: spots
})

export const deleteSpots = (spots) => ({
    type: DELETE_SPOTS,
    payload: spots
})

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(loadSpots(data))
    return response
}

export const getOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    const spotData = await response.json()

    dispatch(loadOneSpot(spotData))
    return response
}

export const addSpot = (spot) => async (dispatch) => {

    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
    })
    if(response.ok){

        const spotData = await response.json()

        const res = await csrfFetch(`/api/spots/${spotData.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: spot.spotImage,
                preview: true
            })
        })
        if(res.ok){

            const imageData = await res.json()

            const combinedData = {previewImage: imageData.url, ...spotData}
            dispatch(createSpots(combinedData))
            return combinedData
        }
    }
}


export const editSpot = (spots) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spots.id}`, {
        method:'PUT',
        body:JSON.stringify(spots)
    })

    if(response.ok){
        const data = await response.json()
        dispatch(editSpots(data))
        return data

    }
}

export const deleteSpot = (spots) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spots.id}`, {
        method: 'DELETE',
        // body:JSON.stringify(spots)
    })
    if(response.ok) {
        const data = await response.json()
        dispatch(deleteSpots(data))
        return response
    }
}

const initialState = { allSpots: {}, singleSpot: {} }

export const spotsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_SPOTS:
        newState = {...state}
        let allSpotsCopy = {}
        action.payload.Spots.forEach(spot => {
            allSpotsCopy[spot.id] = spot
        })
        newState.allSpots = allSpotsCopy
        return newState
        case ADD_SPOTS:
            newState = {...state}
            let newStateCopy = {...newState.allSpots}
            newStateCopy[action.payload.id] = action.payload
            newState.allSpots = newStateCopy
            return newState

        case LOAD_ONE_SPOT:
            newState = {...state}

            newState.singleSpot = action.payload
            return newState

        case EDIT_SPOTS:
            return {...state,
                singleSpot: {
                    ...state.singleSpot,
                    ...action.payload
                }
            }

        case ADD_IMAGE:
                newState = {...state}
                const newSpotImage = {...state.singleSpot}
                newSpotImage[action.payload.singleSpot] = action.payload.singleSpot
                newState.spots = newSpotImage
                return newState

        case DELETE_SPOTS:
            newState={...state}
            let singleSpotCopy = {}
            let SpotsCopy = {}
            newState.singleSpot = singleSpotCopy
            newState.allSpots = SpotsCopy

            delete singleSpotCopy.singleSpot
            delete SpotsCopy.allSpots

            return newState
                default:
                    return state
    }

}
