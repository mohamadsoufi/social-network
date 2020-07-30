import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import CheckCode from "./CheckCode";
import { checkCode } from "../db";
export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 2,
            // step: 3,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/reset-password", {
                email: this.state.email,
            })
            .then(({ data }) => {
                console.log("data :", data);
                if (data.step) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    location.replace("/");
                }
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    render() {
        const { step } = this.state;
        if (step == 2) {
            return <checkCode />;
        } else if (step == 3) {
            return <div></div>;
        } else {
            return (
                <div>
                    <h2>Reset Password</h2>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        placeholder="email"
                        name="email"
                    />

                    <button onClick={() => this.submit()}>Submit</button>
                </div>
            );
        }
    }
}
