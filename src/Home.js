import React, { Component } from "react";

const styles = {
    image: {
        width: "100px",
        height: "100px",
    },
};

export default class Home extends Component {
    render() {
        return (
            <div>
                <img src="/public/logo.png" style={styles.image} />
            </div>
        );
    }
}
