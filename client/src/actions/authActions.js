import setAuthToken from "./../utils/setAuthToken";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register
export const registerUser = (userData, history) => dispatch => {
    axios.post("/api/users/register", userData).then(res => {
        history.push('/dashboard');
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
};

// Login - Get user token
export const loginUser = userData => dispatch => {
    axios.post("/api/users/login", userData).then(res => {
        // Save to local storage
        const token = res.data.token;
        localStorage.setItem('jwt-token', token);
        // Set token to auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user 
        dispatch(setCurrentUser(decoded));

    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    }
};

// log out user
export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    // remove auth header
    setAuthToken(false);
    // Set current user to empty object
    dispatch(setCurrentUser({}));
}