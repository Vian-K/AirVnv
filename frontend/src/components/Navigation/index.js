import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import EditSpotModal from '../EditSpotModal';
import AddSpotModal from '../AddSpotModal';
// import * as sessionActions from '../../store/session';
import './Navigation.css';
import '../AddSpotModal/AddSpotModal.css'
import logo from './AirbnbIcon.PNG'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className="loginbutton">
        <ProfileButton user={sessionUser} />
        {/* <button onClick={logout}>Log Out</button> */}
      </li>
    );
  } else {
    sessionLinks = (
      <li>
    <OpenModalButton
    className="ModalButton"
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
    <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />

      </li>
    );
  }

  return (
    <div className="NavBar">
    <NavLink className="home_button" exact to="/" >
      <img src={logo} />
      <p className="home_button_text">airvnv</p>
        </NavLink>

      {isLoaded && (
        <li>
            <OpenModalButton
      buttonText={<span id="add-a-spot">Airvnv your home</span>}
      modalComponent={<AddSpotModal id="addSpotModal" />}
      />
          <ProfileButton user={sessionUser} />
        </li>
      )}





      </div>
  );
}

export default Navigation;
