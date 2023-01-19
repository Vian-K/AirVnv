import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spot"
import { loadOneSpot } from "../../store/spot"
import EditSpotModal from "../EditSpotModal";
import OpenModalButton from '../OpenModalButton';
const SpotDetail = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const spotDetail = useSelector(state => state.spot.singleSpot)
    // console.log("spotDetail:", spotDetail)

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
        </div>
    )
}


export default SpotDetail
