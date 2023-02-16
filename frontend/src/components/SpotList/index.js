import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Switch, Route } from 'react-router-dom'
import { getSpots } from "../../store/spot"
import SpotDetail from '../SpotDetail'
import './SpotList.css';

 const SpotList = () => {
    const dispatch = useDispatch()
    const spotsObj = useSelector(state => state.spot.allSpots)
    const spots = Object.values(spotsObj)
useEffect(() => {
    dispatch(getSpots())
},[dispatch])

    return (
        <div className="maincontainer">
        <ul>
            {spots.map(({id, name, previewImage, city, state, price, avgRating}) => {
                let rating = parseFloat(avgRating) || 0
                if (rating > 0) {
                    rating = rating.toFixed(1)
                }
                return (
                <li className="images">
                    <NavLink to={`spots/${id}`}>
                    <img id="spotlistimages"src={previewImage} alt={name} />
                    </NavLink>
                    <p className="citystate">{city}, {state}</p>
                    <p className="avgRating">
                        {rating}</p>
                    <p className="price">${price}/night</p>
                </li>
                )
            })}
        </ul>
        <Switch>
            <Route path='/spots/:id'>
                <SpotDetail spot={spots} />

            </Route>
        </Switch>
        </div>
    )
}

export default SpotList
