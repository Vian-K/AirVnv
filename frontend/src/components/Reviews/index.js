import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import  { getUserReviews }  from "../../store/review"
import * as reviewActions from "../../store/review"
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom'
import './UserReviews.css'

const UserReviews = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const reviews = useSelector(state => state.review.userSpecificReviews)
    const reviewsArr = Object.values(reviews)
    const [errors, setErrors] = useState([])
    const user = useSelector(state => state.session.user)
    // console.log("REVIEWS", reviewsArr)


    useEffect(() => {
        dispatch(getUserReviews())
    }, [dispatch])


    if(!reviewsArr.length) {
        return <h1>You have no reviews yet!</h1>
    }


    return (
        <div className="user-reviews"
        >
        <h1 className="reviews-header">My Reviews</h1>
        <div className="user-reviews-data-container">

        {reviewsArr.map(review => {

            return <div className="user-review-data">

                <Link to={`/spots/${review.spotId}`}>{review.Spot.name}</Link>
                <p>{review.Spot.address}{review.Spot.city}, {review.Spot.state}</p>
                <p className="user-review-review">{review.review}</p>
                <p>{review.stars} stars</p>
                <button className="deleteButtonInReviews"
                     type="Delete"
                    onClick={() =>
                     dispatch(reviewActions.deleteReviews(review))
                     .then(() => {;
                        history.push('/reviews/current')
                })}>Delete Review</button>
            </div>
        })}


        </div>

        </div>

    );
}

export default UserReviews;
