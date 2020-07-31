import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

const styles = {
    wrapper: {
        width: "200px",
        margin: "0 auto",
    },
    btn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        textDecoration: "none",
        color: "blue",
        backgroundColor: "white",
        fontSize: "15px",
        fontWeight: "bold",
        width: "200px",
        textTransform: "upperCase",
        padding: "20px",
        transition: "all 0.4s ease 0s",
        cursor: "pointer",
    },
};

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
            <div style={styles.wrapper}>
                {this.state.error && (
                    <div className="error">Oops! You blew it.</div>
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
                <button style={styles.btn} onClick={this.submit}>
                    Register
                </button>

                <Link to="/login"> login </Link>
                <Link to="/reset-password"> reset password </Link>
                <a href="/logout">logout</a>
            </div>
        );
    }
}
