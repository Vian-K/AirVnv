import React, { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { setDemoUser } from '../../store/session';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal()

  if (sessionUser) return (
    <Redirect to="/" />
  );


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }



  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1 className="h1" >Log In</h1>
        {/* <button className="DemoUserButton"
        onClick={() => dispatch(sessionActions.login({credential: "Demo-lition", password: "password"})).then(closeModal) }>Demo User</button> */}
      <ul className="ul">
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className="label">
        Username or Email
        <input className="input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label className='label'>
        Password
        <input className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="Button" type="submit">Log In</button>
    </form>
  );
}

export default LoginFormModal;
