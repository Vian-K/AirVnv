import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SpotList from './components/SpotList'
import SpotDetail from './components/SpotDetail'
import SignupFormPage from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Reviews from "./components/Reviews";
import UserReviews from "./components/Reviews";
import * as reviewActions from "./components/Reviews"
import UserBookings from "./components/UserBookings";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route  exact path='/' >
            <SpotList />
            </Route>

        <Route path='/spots/:id'>
        <SpotDetail />
        </Route>

        <Route path='/reviews/current' >
          <UserReviews />
           </Route>

        <Route path='/bookings/current' >
          <UserBookings />
        </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
