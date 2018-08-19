import axios from "axios";

import { GET_PROFILE, GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER } from "./types";

// Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile/all').then(res => {
        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_PROFILES,
            payload: null,
        });
    });
};

// Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile').then(res => {
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_PROFILE,
            payload: {},
        });
    });
};

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
    axios.post('/api/profile', profileData).then(result => {
        console.log(result);
        history.push('/dashboard')
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
};

// Add Experience
export const addExperience = (expData, history) => dispatch => {
    axios.post('/api/profile/experience', expData).then(res => {
        history.push('/dashboard');
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Add Education
export const addEducation = (eduData, history) => dispatch => {
    axios.post('/api/profile/education', eduData).then(res => {
        history.push('/dashboard');
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Delete Experience
export const deleteExperience = (id) => dispatch => {
    axios.delete(`/api/profile/experience/${id}`).then(res => {
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Delete Education
export const deleteEducation = (id) => dispatch => {
    axios.delete(`/api/profile/education/${id}`).then(res => {
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Profile Loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING,
    }
};

// Clear Profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE,
    }
};

// Delete Account and Profile
export const deleteAccount = () => dispatch => {
    if (window.confirm("You're Deleting you Account! It cannot be undone")) {
        axios.delete('/api/profile').then(res => {
            dispatch({
                type: SET_CURRENT_USER,
                payload: {}
            });
        }).catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            })
        });
    }
}