import React from "react";
import Register from "./Register";

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
            <div style={styles.wrapper}>
                <img src="/public/logo.png" style={styles.image} />

                <div>Hello from welcome page!</div>
                <Register />
            </div>
        );
    }
}
