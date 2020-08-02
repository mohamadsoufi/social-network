import React, { Component, Fragment } from "react";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import axios from "./axios";

const styles = {
    image: {
        width: "100px",
        height: "100px",
    },
};

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProfilePic: false,
            imgUrl: "",
        };
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data: { first, last, bio, profile_pic } }) => {
                this.setState({
                    first: first,
                    last: last,
                    imgUrl: profile_pic,
                });
            })
            .catch((err) => {
                console.log("err in get /user: ", err);
            });
    }

    toggleModal() {
        this.setState({
            ProfilePic: !this.state.ProfilePic,
            imgUrl: this.state.imgUrl,
        });
    }

    updateUrl(e) {
        this.setState({ imgUrl: e });
    }

    render() {
        return (
            <Fragment>
                <img src="/public/logo.png" style={styles.image} alt="logo" />
                {/* <h3
                // onClick={() => {
                //     this.toggleModal();
                // }}
                >
                    change Image
                </h3> */}

                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                    toggleModal={() => this.toggleModal()}
                />

                {this.state.ProfilePic && (
                    <Uploader
                        imgUrl={this.state.imgUrl}
                        toggleModal={(e) => this.toggleModal(e)}
                        updateUrl={(e) => this.updateUrl(e)}
                    />
                )}
            </Fragment>
        );
    }
}
