import React, { Component, Fragment } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // let { first, last, imgUrl } = props;
    // imgUrl = imgUrl || "/img/default.png";

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => {
                console.log("e.target.file :", this.state.file);
            }
        );
    }

    submit() {
        console.log("this.state.file sbmt :", this.state.file);
        // let {
        //         file: this.state.file;
        //     }
        var formData = new FormData();
        formData.append("file", this.state.file);
        console.log("formData :", formData);

        axios
            .post("/upload", formData)
            .then((resp) => {
                // self.images.unshift(resp.data.image)
                console.log("resp in upload ax :", resp);
            })
            .catch((err) => {
                console.log("err in POST /upload: ", err);
            });
    }

    render() {
        return (
            <Fragment>
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
                <button onClick={() => this.submit()}>submit</button>
            </Fragment>
        );
    }
}
