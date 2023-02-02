import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot"
import { useHistory } from "react-router-dom";
import * as spotActions from "../../store/spot"
import * as reviewActions from "../../store/review"
import EditSpotModal from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton';
import ReviewForm from "../ReviewForm";
import './SpotDetail.css';
import '../Navigation/Navigation.css'


const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const spotDetail = useSelector(state => state.spot.singleSpot)
    const reviewsData = useSelector(state => state.review.allReviews)
    const reviews = Object.values(reviewsData)
    console.log("reviewsData", reviewsData)
    console.log("reviews", reviews)

    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if(!spotDetail || !spotDetail.name) {
        return <p>Spot doesn't exist</p>
    }
    let rating = 0;
    reviews.forEach(rev => {
        rating += parseInt(rev.stars)
    })
    const averageRating = reviews.length < 2 ? rating: (rating/reviews.length).toFixed(1)
    return(
        <div className="spotdetails">
            <h1 className="name">{spotDetail.name}</h1>
            <div className="ratingline">
            <p className="avgRatinginDetails">{averageRating}</p>
            <p className="address">{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <div className="editButtoninDetails">
            <OpenModalButton

                buttonText={<span id="editButtoninDetails">Edit</span>}
                modalComponent={<EditSpotModal />} />
</div>
<button className="deletebuttoninDetails"
             onClick={() => dispatch(spotActions.deleteSpot({id})).then(history.push("/"))}
             >Delete Spot</button>
            </div>
            {spotDetail.SpotImages.map(image => {
                return <img id="detailsImage"src={image.url} alt={spotDetail.name} />

            })}

            <p className="description">
                {spotDetail.description}
                <span className="priceinDetails">${spotDetail.price}/night</span></p>

            <ReviewForm />
        </div>
    )
}


export default SpotDetail
