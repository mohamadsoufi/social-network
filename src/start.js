import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome.js";
import Home from "./Home.js";
// import './App.css';
// import logo from './logo.png';

// console.log('logo :', logo);

let elem;
let isLoggedIn = location.pathname !== "/welcome";

if (isLoggedIn) {
    elem = <Home />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));

// export default

// function HelloWorld() {
//     const style = {
//         color: "tomato",
//         fontSize: "20px"
//     };
//     return (
//         <div style={style}>Hello, World!</div>
//     );
// }
