import React from "react";
import Register from "./Register";
import { HashRouter, Route, Link } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "./ResetPassword";

const styles = {
    wrapper: {
        color: "red",
        fontSize: "35px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    image: {
        width: "200px",
        height: "200px",
    },
};

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <HashRouter style={styles.wrapper}>
                <Link to="/login">
                    <img src="/logo.png" style={styles.image} />
                </Link>

                <Route exact path="/" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/reset-password" component={ResetPassword} />
            </HashRouter>
        );
    }
}
