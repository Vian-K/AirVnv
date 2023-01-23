import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as spotActions from "../../store/spot"
import {Redirect} from 'react-router-dom'
import "./AddSpotModal.css"

export const AddSpotModal = () => {
  const [address, setAddress ] = useState('')
  const [city, setCity ] = useState('')
  const [state, setState ] = useState('')
    const [country, setCountry ] = useState('')
    const [name, setName ] = useState('')
    const [description, setDescription ] = useState('')
    const [price, setPrice ] = useState('')
    const [spotImage, setSpotImage ] = useState('')
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal()
    const dispatch = useDispatch()


    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
        return dispatch(spotActions.addSpot({address, city, state, country, name, description, price, spotImage, lat:15, lng:15}))
        .then(() => {
          closeModal()

        })
        .catch(async (res) => {
          console.log(res)
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
        })
    }

    return (
      <div className="addspotModal">


        <form className="addspotform" onSubmit={handleSubmit}>
            <h1 className="formtitle">Add a Spot</h1>
            <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className="label">
        Address
        <input className="addressinput"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label className="label">
        City
        <input className="cityinput"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label className="label">
        State
        <input className="stateinput"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label className="label">
       Country
        <input className="countryinput"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Name
        <input className="nameinput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Description
        <input className="descriptioninput"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Price
        <input className="priceinput"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <label className="label">
        Add an Image
        <input className="imageinput"
          type="text"
          value={spotImage}
          onChange={(e) => setSpotImage(e.target.value)}
          required
        />
      </label>

      <button className="createButton" type="Create">Create</button>
        </form>
        </div>
    )
}

export default AddSpotModal;
