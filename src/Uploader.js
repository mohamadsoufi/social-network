import React, { Component, Fragment } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgUrl: this.props.imgUrl,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }

    toggleModal(e) {
        this.setState({
            imgUrl: e,
        });
    }

    submit() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        this.props.toggleModal();

        axios
            .post("/upload", formData)
            .then(({ data }) => {
                this.props.updateUrl(data);
            })

            .catch((err) => {
                console.log("err in POST /upload: ", err);
            });
    }

    render() {
        return (
            <Fragment>
                <input
                    className="upload-file"
                    onChange={(e) => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
                <label className="upload-file-label">
                    <img
                        className="upload-icon"
                        src="https://img.icons8.com/color/96/000000/add-image.png"
                    />
                </label>
                <button className="upload-btn" onClick={() => this.submit()}>
                    submit
                </button>
            </Fragment>
        );
    }
}
