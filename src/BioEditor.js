import React, { Component } from "react";
import axios from "./axios";

export class BioEditor extends Component {
    constructor(props) {
        super(props);
        // console.log("props in bio const :", props);
        this.state = {
            mode: "read",
            bio: "",
            id: "",
        };
    }

    changeHandler(e) {
        this.setState({
            bio: e.target.value,
        });
    }

    save() {
        axios
            .post("/update-bio", {
                text: this.state.bio,
            })
            .then(({ data: { bio, id, success } }) => {
                if (success) {
                    this.setState({
                        bio: bio,
                        id: id,
                        mode: "read",
                    });
                    this.props.setBio(this.state.bio);
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

    editMode() {
        this.setState({
            mode: "edit",
        });
    }

    render() {
        // console.log("this.props in bio render :", this.props);
        if (this.state.mode === "edit") {
            return (
                <div className="bio-textarea">
                    <textarea
                        name="bio-text"
                        id="bio-text"
                        cols="30"
                        rows="5"
                        defaultValue={
                            this.props.bio || "Say something about yourself :)"
                        }
                        onChange={(e) => this.changeHandler(e)}
                    ></textarea>

                    <button
                        onClick={() => {
                            this.save();
                        }}
                    >
                        Save
                    </button>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div className="bio-text-container">
                    <h2>{this.props.bio}</h2>

                    <button
                        className="edit-bio-btn"
                        onClick={() => {
                            this.editMode();
                        }}
                    >
                        Edit Bio
                    </button>
                </div>
            );
        } else if (this.state.bio === "") {
            return (
                <div>
                    {this.state.error && (
                        <div className="error">Oops! try again!.</div>
                    )}

                    <button
                        onClick={() => {
                            this.editMode();
                        }}
                    >
                        Add Bio
                    </button>
                </div>
            );
        }
    }
}
