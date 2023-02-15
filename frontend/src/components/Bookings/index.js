import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import * as bookingActions from '../../store/booking'
import { getBookings, addBookings } from "../../store/booking";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookings.css'


const Bookings = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const bookingsData = useSelector(state => state.booking.allBookings)
    const bookingsArr = Object.values(bookingsData)
    const [bookings, setBookings ] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [blockedDates, setBlockedDates] = useState([])
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    // const spotDetail = useSelector(state => state.spot.singleSpot)


    useEffect(() => {
        dispatch(getBookings(id))
        updateblockedDates()
    }, [dispatch, id])

   const bookingInputs = (start, end) => {
    setStartDate(formatDate(start))
    setEndDate(formatDate(end))

    setBookings([...bookingsArr, { startDate: start, endDate: end}])
   }

   const updateblockedDates = () => {
       let blocked = []
    bookingsArr.forEach(booking => {
        let start = new Date(booking.startDate)
        let end = new Date(booking.endDate)
        let date = start;
        while (date <= end) {
            blocked.push(new Date(date));
            date.setDate(date.getDate() + 1);
          }
    })
    bookingsArr.map(({startDate, endDate}) => {
       blocked.push(startDate, endDate)
    })
    setBlockedDates(blocked)

   }

   const formatDate = date => {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0")
    let day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
   }
  
   return (
    <div className="main-bookings">
      <div>
        {!isBookingOpen ? (
          <button className="open-calendar" onClick={() => setIsBookingOpen(true)}>Open Calendar</button>
        ) : (
          <>
            <Calendar
              onChange={(date) => bookingInputs(date[0], date[1])}
              selectRange
              tileDisabled={({ date }) => {
                const formattedDate = formatDate(date);
                return bookingsArr.some(booking => {
                  return (
                    formattedDate >= formatDate(new Date(booking.startDate)) &&
                    formattedDate <= formatDate(new Date(booking.endDate))
                  );
                });
              }}
            />
            <button
              className="bookingsubmit"
              onClick={() => dispatch(addBookings({ id, startDate, endDate }))}
            >
              Reserve
            </button>
            <button className="cancelButton" onClick={() => setIsBookingOpen(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Bookings;
