import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getUserReviews from "../../store/review"

const UserReviews = () => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => state.review.userSpecificReviews)
    const reviewsArr = Object.values(reviews)
    // const user = useSelector(state => state.session.user)
    console.log("REVIEWS", reviews)

    // useEffect(() => {

    //         dispatch(getUserReviews())


    // }, [dispatch])

    if(!reviewsArr.length) {
        return <div>You have no reviews yet</div>
    }
    return (null
        // <>
        // <div className="user-reviews"
        // >
        // {reviewsArr.reverse().map(review => {
        //     return <p>{review}</p>
        // })}

        // </div>
        // </>
    );
}

export default UserReviews;
