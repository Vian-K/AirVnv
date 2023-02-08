import React, { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

import './Navigation.css';
import './Capture.PNG'


function ProfileButton({ user }) {

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const sessionUser = useSelector(state => state.session.user)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  return (
    <>
    <div className="Nav">
    <div className="profile_dropdown">
      <button className="profile_button" onClick={openMenu}>
        {/* <i className="fas fa-user-circle" /> */}
      </button>
      <ol className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className="user-content">
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button className="logoutbutton"onClick={logout}>Log Out</button>
            </li>
          </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem id="modal"
              itemText={<span className="item-text-log-in">Log In</span>}
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText={<span className="item-text-sign-up">Sign Up</span>}
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
        {!sessionUser ? (

          <button className="DemoUserButton"
          onClick={() => dispatch(sessionActions.login({credential: "Demo-lition", password: "password"}))}>Demo User</button>
          ) : null}

        {sessionUser ? (
           <NavLink className="user-reviews-button" exact to="/reviews/current">
              <p className="user-reviews-button-text">My Reviews</p>
         </NavLink>
          ) : null}
      </ol>
      </div>
    </div>
    </>
  );
}

export default ProfileButton;
