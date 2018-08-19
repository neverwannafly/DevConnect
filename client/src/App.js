import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import { Provider } from "react-redux";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/add-experience";
import AddEducation from "./components/add-credentials/add-education";
import Profiles from "./components/profiles/Profiles";
import store from "./store";

import "./App.css";
import { clearCurrentProfile } from "./actions/profileActions";
import Profile from "./components/profile/Profile";
import NotFound from "./components/not-found/NotFound";

// Check for token

if (localStorage['jwt-token']) {
  console.log(localStorage);
  const token = localStorage['jwt-token'];
  // Set auth token header auth
  setAuthToken(token);
  // Decode token and get user info
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now()/1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }

}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register/" component={Register} />
              <Route exact path="/login/" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />
              <Route exact path="/not-found/" component={NotFound} />
              <Switch>
                <PrivateRoute exact path="/dashboard/" component={Dashboard} />
                <PrivateRoute exact path="/create-profile/" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile/" component={EditProfile} />
                <PrivateRoute exact path="/add-experience/" component={AddExperience} />
                <PrivateRoute exact path="/add-education/" component={AddEducation} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
