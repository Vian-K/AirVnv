import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Switch, Route } from 'react-router-dom'
import { getSpots } from "../../store/spot"
import SpotDetail from '../SpotDetail'
import './SpotList.css';

 const SpotList = () => {
    const dispatch = useDispatch()
    const spots = Object.values(useSelector(state => state.spot.allSpots))

useEffect(() => {
    dispatch(getSpots())
},[dispatch])

    return (
        <div className="maincontainer">
        <ul>
            {spots.map(({id, name, previewImage, city, state, price, avgRating}) => {
                return (
                <li className="images">
                    <NavLink to={`spots/${id}`}>
                    <img src={previewImage} alt={name} />
                    </NavLink>
                    <p className="city/state">{city}, {state}</p>
                    <p className="avgRating">{avgRating}</p>
                    <p className="price">${price}</p>
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
