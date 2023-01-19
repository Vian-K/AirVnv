import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {useState} from 'react'
import { useParams } from "react-router-dom";

import * as spotActions from "../../store/spot"

export const EditSpotModal = () => {
  const {id} = useParams()

  const spots = useSelector(state => state.spot.singleSpot)
    const [address, setAddress ] = useState(spots.address)
    const [city, setCity ] = useState(spots.city)
    const [state, setState ] = useState(spots.state)
      const [country, setCountry ] = useState(spots.country)
      const [name, setName ] = useState(spots.name)
      const [description, setDescription ] = useState(spots.description)
      const [price, setPrice ] = useState(spots.price)
      // const [image, setImage ] = useState(null)
      const [errors, setErrors] = useState([]);
      const { closeModal } = useModal()
      const dispatch = useDispatch()


const handleSubmit = (e) => {
    e.preventDefault()
    setErrors([])
    return dispatch(spotActions.editSpot({id, address, city, state, country, name, description, price, lat:15, lng:15}))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json()
        if(data && data.errors) setErrors(data.errors)
    })
}

    return(
        <form className="editspotform" onSubmit={handleSubmit}>
            <h1 className="h1">Edit a Spot</h1>
            <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className="label">
        Address
        <input className="input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label className="label">
        City
        <input className="input"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label className="label">
        State
        <input className="input"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label className="label">
       Country
        <input className="input"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Name
        <input className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Description
        <input className="input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Price
        <input className="input"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button className="Button" type="Submit">Submit</button>

      </form>
    )
}

export default EditSpotModal;
