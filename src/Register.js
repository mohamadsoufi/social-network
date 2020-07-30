import React from "react";
import axios from "axios";

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
            [e.target.last]: e.target.value,
            [e.target.email]: e.target.value,
            [e.target.password]: e.target.value,
        });
    }

    submit() {
        console.log("this.state.first submit :", this.state.last);
        console.log("this.state.pass submit :", this.state.password);
        console.log("test :", this.state.test);
        let self = this;
        axios
            .post("/register", {
                first: self.state.first,
                last: self.state.last,
                email: self.state.email,
                password: self.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    self.setState({
                        error: true,
                    });
                }
            })
            .catch(() =>
                self.setState({
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
                />
                <button style={styles.btn} onClick={this.submit}>
                    Register
                </button>
            </div>
        );
    }
}
