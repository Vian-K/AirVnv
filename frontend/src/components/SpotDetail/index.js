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
    const spotDetail = useSelector(state => state.spot[id])


    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if(!spotDetail) {
        return <p>Spot doesn't exist</p>
    }
    return(
        <div>
            <h1>{spotDetail.name}</h1>
            <p>{spotDetail.address}, {spotDetail.city}, {spotDetail.state}, {spotDetail.country}</p>
            <p>{spotDetail.description}</p>
            <p>{spotDetail.price}</p>
            <img src={spotDetail.previewImage} alt={spotDetail.name} />
            <p>Avg Rating: {spotDetail.avgRating}</p>
            <OpenModalButton
      buttonText="Edit a Spot"
      modalComponent={<EditSpotModal />}
      />
        </div>
    )
}


export default SpotDetail
