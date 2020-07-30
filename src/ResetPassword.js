import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }
    render() {
        const { step } = this.state;
        if (step == 1) {
            return <div></div>;
        } else if (step == 2) {
            return <div></div>;
        } else {
            return <div></div>;
        }
    }
}
