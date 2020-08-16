import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() => {
                self.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="login-container">
                {this.state.error && (
                    <div className="error">Oops! something went wrong!</div>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="email"
                />

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="password"
                    type="password"
                />

                <button onClick={() => this.submit()}>Login</button>
                <Link to="/"> register </Link>
                <Link to="/reset-password"> Reset Password </Link>
            </div>
        );
    }
}
