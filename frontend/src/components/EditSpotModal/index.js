import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {useState} from 'react'
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import * as spotActions from "../../store/spot"
import './EditSpotModal.css'


export const EditSpotModal = () => {
  // const {id} = useParams()

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
  const history = useHistory()
  const id = spots.id

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors([])

    return dispatch(spotActions.editSpot({id, address, city, state, country, name, description, price, lat:15, lng:15}))
    .then(() => {
      closeModal()
      // history.push(`/spots/${id}`)
    })

    .catch(async (res) => {
      const data = await res.json()
      if(data && data.errors) setErrors(data.errors)
    })
  }

    return(
      <div className="editspotmodal">


        <form className="editspotform" onSubmit={handleSubmit}>
            <h1 className="editspottitle">Edit a Spot</h1>
            <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className="label">
        Address
        <input className="input"
          type="text"
          value={address}
          maxLength={25}
          onKeyPress={(e) => {
            if(e.target.value.length === 25) {
               e.preventDefault()
               if (!errors.includes("Address must be less than 25 characters")) {
                setErrors([...errors, "Address must be less than 25 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setAddress(e.target.value);
            setErrors(errors.filter(error => error !== "Address must be less than 25 characters"));
          }}
          required
        />
      </label>
      <label className="label">
        City
        <input className="input"
          type="text"
          value={city}
          maxLength={25}
          onKeyPress={(e) => {
            if(e.target.value.length === 25) {
               e.preventDefault()
               if (!errors.includes("City must be less than 25 characters")) {
                setErrors([...errors, "City must be less than 25 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setCity(e.target.value);
            setErrors(errors.filter(error => error !== "City must be less than 25 characters"));
          }}
          required
        />
      </label>
      <label className="label">
        State
        <input className="input"
          type="text"
          value={state}
          maxLength={25}
          onKeyPress={(e) => {
            if(e.target.value.length === 25) {
               e.preventDefault()
               if (!errors.includes("State must be less than 25 characters")) {
                setErrors([...errors, "State must be less than 25 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setState(e.target.value);
            setErrors(errors.filter(error => error !== "State must be less than 25 characters"));
          }}
          required
        />
      </label>
      <label className="label">
       Country
        <input className="input"
          type="text"
          value={country}
          maxLength={25}
          onKeyPress={(e) => {
            if(e.target.value.length === 25) {
               e.preventDefault()
               if (!errors.includes("Country must be less than 25 characters")) {
                setErrors([...errors, "Country must be less than 25 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setCountry(e.target.value);
            setErrors(errors.filter(error => error !== "Country must be less than 25 characters"));
          }}
          required
        />
      </label>
      <label className="label">
        Name
        <input className="input"
          type="text"
          value={name}
          maxLength={25}
          onKeyPress={(e) => {
            if(e.target.value.length === 25) {
               e.preventDefault()
               if (!errors.includes("Name must be less than 25 characters")) {
                setErrors([...errors, "Name must be less than 25 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setName(e.target.value);
            setErrors(errors.filter(error => error !== "Name must be less than 25 characters"));
          }}
          required
        />
      </label>
      <label className="label">
        Description
        <input className="input"
          type="text"
          value={description}
          maxLength={100}
          onKeyPress={(e) => {
            if(e.target.value.length === 100) {
               e.preventDefault()
               if (!errors.includes("Description must be less than 100 characters")) {
                setErrors([...errors, "Description must be less than 100 characters"]);
              }
            }
          }
        }
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors(errors.filter(error => error !== "Description must be less than 100 characters"));
          }}
          required
        />
      </label>
      <label className="label">
        Price
        <input className="input"
          type="text"
          value={price}
          onChange={(e) => {
            if(e.target.value < 0) {
              setErrors([...errors, "Price must be greater than 0"])
            } else {
              setPrice(e.target.value)
              setErrors(errors.filter(error => error !== "Price must be greater than 0"))
            }
          }
        }

          required
        />

      </label>

<button className="EditButton" type="Submit">Submit</button>

      </form>
      </div>
    )
}

export default EditSpotModal;
