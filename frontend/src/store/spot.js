
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

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()
    dispatch(loadSpots(data))
    return response
}

export const getOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    const spotData = await response.json()
    console.log("spotData=", spotData)
    dispatch(loadOneSpot(spotData))
    return response
}

export const addSpot = (spot, spotImage) => async (dispatch) => {
    console.log("spots", spot)
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
    })
    if(response.ok){
        console.log("spots=", spot)
        const spotData = await response.json()

        const res = await csrfFetch(`/api/spots/${spotData.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: spot.spotImage,
                preview: true
            })
        })
        if(res.ok){
            console.log("spotsData=", spotData)
            const imageData = await res.json()
            console.log("imageData=", imageData)
            const combinedData = {previewImage: imageData.url, ...spotData}
            dispatch(createSpots(combinedData))
            return combinedData
        }
    }
}




export const editSpot = (spots) => async (dispatch) => {
    console.log("spots", spots)
    const response = await csrfFetch(`/api/spots/${spots.id}`, {
        method:'PUT',
        body:JSON.stringify(spots)
    })

    if(response.ok){
        const data = await response.json()
        dispatch(editSpots(data))
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
            newState.allSpots[action.payload.id] = action.payload
            return newState

        case LOAD_ONE_SPOT:
            newState = {...state}

            newState.singleSpot = action.payload
            return newState

        case EDIT_SPOTS:
            newState = {...state}
            console.log("action.payload", action.payload)

            newState.singleSpot[action.payload.id] = action.payload

            return newState


            case ADD_IMAGE:
                newState = {...state}
                const newSpotImage = {...state.singleSpot}
                console.log(newSpotImage)
                newSpotImage[action.payload.singleSpot] = action.payload.singleSpot
                newState.spots = newSpotImage
                return newState

                default:
                    return state
    }

}
