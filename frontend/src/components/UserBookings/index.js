import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { getUserBookings } from "../../store/booking";

const UserBookings = () => {
    const dispatch = useDispatch()
    const bookings = useSelector(state => state.booking.userSpecificBookings)
    const bookingsArr = Object.values(bookings)


useEffect(() => {
    dispatch(getUserBookings())
}, [dispatch])

    return(
        <div className="user-bookings">
        <h1>My Bookings</h1>

        {bookingsArr.map(booking => {
            console.log("BOOKING", booking)
            return <div className="user-bookings-data">
                <p>{booking.Spot.name}</p>
                <p>{booking.Spot.address}</p>
                <p>{booking.Spot.city}{booking.Spot.state}</p>

                <p>{booking.startDate}</p>
                <p>{booking.endDate}</p>


            </div>
        })}
        </div>
    )
}

export default UserBookings;
