import React, { Component, Fragment } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    // let { first, last, imgUrl } = props;
    // imgUrl = imgUrl || "/img/default.png";

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        let formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then((resp) => {
                // self.images.unshift(resp.data.image)
                console.log("resp :", resp);
            })
            .catch((err) => {
                console.log("err in POST /upload: ", err);
            });
    }

    return() {
        <Fragment>
            <input
                onChange={(e) => this.handleChange(e)}
                type="file"
                name="file"
                accept="image/*"
            />
            <button onClick={() => this.submit()}>submit</button>
        </Fragment>;
    }
}
