import React, { Fragment } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import CheckCode from "./CheckCode";
export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // step: 2,
            // step: "",
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
                console.log("data.step :", data);
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

    submitTo() {
        // this.props.Submit();
        axios
            .post("/check-code", {
                email: this.state.email,
                code: this.state.code,
                password: this.state.password,
            })
            .then(({ data }) => {
                console.log("data in child :", data);
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
        const { step } = this.state;

        if (step == 2) {
            return (
                <Fragment>
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

                    <button onClick={() => this.submitTo()}>Submit</button>
                </Fragment>
            );
        } else if (step == 3) {
            return (
                <div>
                    <h3>Success!</h3>
                    <Link to="login">log in</Link>
                </div>
            );
        } else {
            return (
                <Fragment>
                    <h2>Reset Password</h2>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        placeholder="email"
                        name="email"
                    />

                    <button onClick={() => this.submit()}>Submit</button>
                </Fragment>
            );
        }

        // return (
        //     <div>
        //         {step == 1 && (
        //             <div>
        //                 <h2>Reset Password</h2>
        //                 <input
        //                     onChange={(e) => this.handleChange(e)}
        //                     placeholder="email"
        //                     name="email"
        //                 />
        //                 <button onClick={() => this.submit()}>Submit</button>
        //             </div>
        //         )}
        //         {step == 2 && <checkCode />}
        //         {step == 3 && <div></div>}
        //     </div>
        // );
    }
}
