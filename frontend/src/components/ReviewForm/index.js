import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as reviewActions from "../../store/review"
import { getReviews} from "../../store/review"


const ReviewForm = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [review, setReviews ] = useState()
    const [stars, setStars] = useState("5")
    const [errors, setErrors] = useState([]);
    const [hasError, setHasError] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false)
    const reviewsObj = useSelector(state => state.review.allReviews)
    const reviews = Object.values(reviewsObj)




    useEffect(() => {
        dispatch(getReviews(id))
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        return dispatch(reviewActions.addReviews( {id,review, stars}))
        .then(() =>{
            dispatch(reviewActions.getReviews(id))
            setIsReviewOpen(false)
        })
        .catch(async (res) => {
          const data = await res.json()
          if(data && data.errors) setErrors(data.errors)
          setHasError(true)

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
                 onChange={(e) => setReviews(e.target.value)}
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






                {reviews.map(review => {

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

                            <button className="deleteButtonInReviews" type="Delete"

                        onClick={() => dispatch(reviewActions.deleteReviews(review))
                            .then(() =>{
                                dispatch(reviewActions.getReviews(id))
                                setIsReviewOpen(false)
                            } )}
                            >Delete Review</button>

                            </ul>

                    })}
                </div>


        </div>
    )
}

export default ReviewForm;
