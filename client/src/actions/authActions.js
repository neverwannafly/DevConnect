import { GET_ERRORS } from "./types";
import axios from "axios";

// Register
export const registerUser = userData => dispatch => {
    axios.post("/api/users/register", userData).then(res => {

    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
};


// this.setState({
//     errors: err.response.data,
//     password: "",
//     password2: "",
// });