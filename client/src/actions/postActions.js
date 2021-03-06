import axios from "axios";
import { ADD_POST, CLEAR_ERRORS, GET_POST, GET_POSTS, POST_LOADING, GET_ERRORS, DELETE_POST } from "./types";

// Add post
export const addPost = postData => dispatch => {
    axios.post('/api/posts', postData).then(res => {
        dispatch(clearErrors());
        dispatch({
            type: ADD_POST,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        })
    });
};

// Get Posts
export const getPosts = () => dispatch => {
    dispatch(setPostLoading());
    axios.get('/api/posts').then(res => {
        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_POSTS,
            payload: null,
        });
    });
};

// Get Post by id
export const getPost = (id) => dispatch => {
    dispatch(setPostLoading());
    axios.get(`/api/posts/${id}`).then(res => {
        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_POST,
            payload: null,
        });
    });
};

// Like Post
export const likePost = (id) => dispatch => {
    axios.post(`/api/posts/like/${id}`).then(res => {
        // TODO: Make this more efficient
        dispatch(getPosts());
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Unlike Post
export const unlikePost = (id) => dispatch => {
    axios.post(`/api/posts/unlike/${id}`).then(res => {
        // TODO: Make this more efficient
        dispatch(getPosts());
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
}

// Delete Post
export const deletePost = (id) => dispatch => {
    axios.delete(`/api/posts/${id}`).then(res => {
        dispatch({
            type: DELETE_POST,
            payload: id,
        })
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        });
    });
};

// Add Comment
export const addComment = (commentData, postId) => dispatch => {
    axios.post(`/api/posts/comment/${postId}`, commentData).then(res => {
        // TODO: Make this more efficient
        dispatch(clearErrors());
        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        })
    });
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
    axios.delete(`/api/posts/comment/${postId}/${commentId}`).then(res => {
        // TODO: Make this more efficient
        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
        })
    });
};

// Set loading state
export const setPostLoading = () => {
    return {
        type: POST_LOADING,
    }
};

// Clear Errors
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS,
    }
};