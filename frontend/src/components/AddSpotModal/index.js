import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as spotActions from "../../store/spot"

import "./AddSpotModal.css"
import { useHistory } from "react-router-dom";


export const AddSpotModal = () => {
  const user = useSelector(state => state.session.user)
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
    const history = useHistory()


    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([])
try {
  const url = new URL(spotImage)
if(url.protocol !== "http:" && url.protocol !== 'https:') {
  setErrors(errors => [...errors, "Url is not a valid image Url"])
  return
}
} catch (e) {
  setErrors(errors => [...errors, "Url is not a valid image Url"])
  return
}
if(price >= 25000 && !errors.includes("This price is above the maximum limit")) {
  // setErrors(errors.filter(error => error !== "This price is above the maximum"))
  setErrors([...errors, "This price is above the maximum limit"])
  setTimeout(() => {
    setErrors([]);
  }, 3000);
  return
}

        return dispatch(spotActions.addSpot({address, city, state, country, name, description, price, spotImage, lat:15, lng:15}))
        .then(() => {
          closeModal()
          history.push('/')

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
        <input className="cityinput"
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
        <input className="stateinput"
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
        <input className="countryinput"
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
        <input className="nameinput"
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
        <input className="descriptioninput"
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
        <input className="priceinput"
          type="text"
          value={price}

          onChange={(e) => {
            setPrice(e.target.value);
            if (e.target.value.length === 0) {
              setErrors(errors.filter(error => error !== "Price must be greater than 0"));
            } else if (e.target.value <= 0 && !errors.includes("Price must be greater than 0")) {
              setErrors([...errors, "Price must be greater than 0"]);
            } else if (e.target.value > 0) {
              setErrors(errors.filter(error => error !== "Price must be greater than 0"));
            }

          }}

          required
        />
      </label>
      <label className="label">
        Add an Image
        <input className="imageinput"
          type="text"
          value={spotImage}
          onChange={(e) => {setSpotImage(e.target.value)}
      }

          required
        />
      </label>

      <button className="createButton" type="Create">Create</button>
        </form>
        {user && user.id === 1 ? (

<button className="demoaddButton" type="Create"
onClick={() => dispatch(spotActions.addSpot({address:"test", city:"test", state:"test", country:"test", name:"test", description:"test", price:"123", spotImage:"https://a0.muscache.com/im/pictures/3721c4eb-3da9-4526-8a19-7307de85fa1a.jpg?im_w=1200", lat:15, lng:15}))
.then(() => {
  closeModal()
  history.push('/')

})}
>Demo Add Spot</button>
) : null}
        </div>
    )
}

export default AddSpotModal;
