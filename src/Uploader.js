import React, { Component, Fragment } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        let { imgUrl } = props;
        console.log("props in uploader :", props);
        console.log("imgUrl in uploader:", imgUrl);
        this.state = {
            imgUrl: this.props.imgUrl,
        };
    }
    // imgUrl = imgUrl || "/img/default.png";

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
                console.log("{data} in upload ax :", data);

                console.log("this.props.imgUrl :", this.props.imgUrl);

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
