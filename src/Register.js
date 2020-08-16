import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
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
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    render() {
        return (
            <div className="register-container">
                {this.state.error && (
                    <div className="error">Oops! try again!.</div>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="first"
                    name="first"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="last"
                    name="last"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="email"
                    name="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    placeholder="password"
                    name="password"
                    type="password"
                />
                <button onClick={this.submit}>Register</button>

                <Link to="/login"> Login </Link>
            </div>
        );
    }
}
