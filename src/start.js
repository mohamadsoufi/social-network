import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome.js";
import Home from "./Home.js";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./Redux/reducer";
import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    elem = (
        <Provider store={store}>
            <Home />
        </Provider>
    );
    init(store);
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
