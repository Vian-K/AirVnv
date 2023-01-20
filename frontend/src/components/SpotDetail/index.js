import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot"
import { useHistory } from "react-router-dom";
import * as spotActions from "../../store/spot"
import * as reviewActions from "../../store/review"
import EditSpotModal from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton';

const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const spotDetail = useSelector(state => state.spot.singleSpot)
    const review = useSelector(state => state.review)
    const [reviews, setReviews ] = useState('')
    const [stars, setStars] = useState(null)
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        return dispatch(reviewActions.addReview({id, review, stars}))

        .catch(async (res) => {
          const data = await res.json()
          if(data && data.errors) setErrors(data.errors)
        })
      }


    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if(!spotDetail || !spotDetail.name) {
        return <p>Spot doesn't exist</p>
    }

    return(
        <div>
            <h1>{spotDetail.name}</h1>
            <p>{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p>{spotDetail.description}</p>
            <p>{spotDetail.price}</p>
            {spotDetail.SpotImages.map(image => {
                return <img src={image.url} alt={spotDetail.name} />

            })}
            <p>Avg Rating: {spotDetail.avgRating}</p>
            <OpenModalButton
                buttonText="Edit a Spot"
                modalComponent={<EditSpotModal />} />

            <button className="delete"
             onClick={() => dispatch(spotActions.deleteSpot({id})).then(history.push("/"))}
             >Delete Spot</button>

             <div>
                 {errors.map((error, idx) => <li key={idx}>{error}</li>)}

                <h2>Reviews</h2>
                <input className="input" onSubmit={handleSubmit}
                type='textbox'
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                >
                </input>
                <button className="reviewButton" type="Submit">Submit</button>
             </div>
        </div>
    )
}


export default SpotDetail
