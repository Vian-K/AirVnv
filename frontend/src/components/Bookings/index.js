import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import * as bookingActions from '../../store/booking'
import { getBookings } from "../../store/booking";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

const Bookings = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [date, setDate] = useState(new Date())
    const bookings = useSelector(state => state.booking.allBookings)
    const bookingsArr = Object.values(bookings)
    const spotDetail = useSelector(state => state.spot.singleSpot)


    useEffect(() => {
        dispatch(getBookings(id))
    }, [dispatch, id])

    const onChange = date => {
        setDate(date)
    }
    return (
        <div className="main-bookings">
            {bookingsArr.map(({id, User, startDate, endDate}) => {
                // console.log("LOOPBOOKING", id)
                return <li>
                    <p>{User.firstName} {User.lastName}</p>
                    <p>startDate:{startDate}</p>
                    <p>endDate:{endDate}</p>
                </li>
            })}
            <div>
            <Calendar onChange={onChange} value={date}/>
            {console.log(date)}
            {date.toString()}
            </div>



        </div>
    );
}

export default Bookings;
