import React from "react";
import axios from "./axios";
import ResetPassword from "./ResetPassword";

export default class CheckCode extends React.Component {
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
            .post("/check-code", {
                email: this.state.email,
            })
            .then(({ data }) => {
                console.log("data :", data);
                if (data.step) {
                    this.setState({
                        step: 3,
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
        return (
            <div>
                <h2>Reset Password</h2>
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="code"
                    name="code"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="password"
                    name="password"
                />

                <button onClick={() => this.submit()}>Submit</button>
            </div>
        );
    }
}
