import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from './reducers/index';
import thunk from "redux-thunk";

const initialState = {};
const middleware = [thunk];
let store;

const isDevelopment = !!window.chrome && !!window.chrome.webstore;

if (isDevelopment) {
    store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
            // to enable chrome extension
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    );
} else {
    store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
        )
    );
}


export default store;