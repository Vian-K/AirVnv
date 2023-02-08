import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as reviewActions from "../../store/review"
import { getReviews} from "../../store/review"
import SpotDetail from "../SpotDetail";
import './ReviewForm.css'

const ReviewForm = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [review, setReviews ] = useState("")
    const [stars, setStars] = useState("5")
    const [errors, setErrors] = useState([]);
    const [hasError, setHasError] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    // const [errorVisible, setErrorVisible] = useState(false)
    const reviewsObj = useSelector(state => state.review.allReviews)
    const user = useSelector(state => state.session.user)
    const reviews = Object.values(reviewsObj)
    // const errorsArr = Object.values(data.errors)



    useEffect(() => {
        dispatch(getReviews(id))
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        if(!review) {
            setErrors(errors => [...errors, "This field cannot be blank"])
            return
        }
        if(errors.length > 0) {
            return
        }

        return dispatch(reviewActions.addReviews( {id,review, stars}))
        .then(() =>{
            dispatch(reviewActions.getReviews(id))
            setIsReviewOpen(false)
        })
        .catch(async (res) => {
            const data = await res.json();
            if(data && data.errors) setErrors(data.errors);
            setHasError(true);

            setTimeout(() => {
              setErrors([]);
              setHasError(false);
            }, 5000);
          })
        }



    return(
        <div className="reviewscontainer">

        <div>

            <div>

            <form className="reviews" onSubmit={handleSubmit}>
                 {/* {errors.map((error, idx) => <li className="errors" key={idx}>{error.message}</li>)} */}

                 {!isReviewOpen && (
                    <button className="addareview"onClick={() => setIsReviewOpen(true)}>Add a Review</button>
                )}
                 {isReviewOpen ? (
                     <div>


       <textarea className="textarea"
                 type='textbox'
                 defaultValue="Add your review here"
                 onFocus={(e) => {
                    if (e.target.defaultValue === "Add your review here") {
                        setReviews("")
                    }

                }}
                 value={review}
                 maxLength={255}
                 onKeyPress={(e) => {
                        if(e.target.value.length >= 255) {
                            e.preventDefault()
                            if(!errors.includes("Review must be less than 255 characters"))
                            setErrors([...errors, "Review must be less than 255 characters" ])
                        }
                        }
                }
                onChange={(e) => {
                    setReviews(e.target.value)
                    setErrors(errors.filter(error => error !== "Review must be less than 255 characters"))
                }}
                required
                 >
                 </textarea>

                 <select className="stars" value={stars} onChange={(e) => setStars(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    </select>
                <button className="submitButton" type="Submit">Submit</button>
                <button className="cancelButton" onClick={() => setIsReviewOpen(false)}>Cancel</button>

                </div>
                ) : null}
                </form>
                </div>

                {errors.map((error, idx) => {
                      setTimeout(()=>{
                        setErrors(errors.filter((_, i) => i !== idx))
                      },8000)
                      return <li className="errors" key={idx}>{error.message}</li>
                    })}

                <h4 className="reviewdivider">{reviews.length} reviews</h4>


                {reviews.reverse().map(review => {

                        return <ul className="reviewsList" >
                            <div className="reviewDataName">
                              {review.User ? review.User.firstName : ''}
                            </div>
                            <div className="reviewDataReview">
                            {review.review}
                            </div>
                            <div className="reviewDataStars">
                             {review.stars}
                            </div>

                            {user && user.id === review.userId ? (
                            <button className="deleteButtonInReviews"
                                type="Delete"
                                onClick={() =>
                                    dispatch(reviewActions.deleteReviews(review))
                                    .then(() => {
                                    dispatch(reviewActions.getReviews(id));
                                    setIsReviewOpen(false);
                            })
                    }
                >Delete Review</button>) : null}
                            </ul>


                    })}
                </div>


        </div>
    )
}

export default ReviewForm;
