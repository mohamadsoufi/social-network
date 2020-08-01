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
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        console.log("App has mounted!!!!");
        axios
            .get("/user")
            .then(({ data: { first, last, bio, Profile_pic } }) => {
                this.setState({
                    first: first,
                    last: last,
                    imgUrl: Profile_pic,
                });
            })
            .catch((err) => {
                console.log("err in get /user: ", err);
            });
    }

    toggleModal() {
        console.log("toggle modal is running");
        this.setState({
            ProfilePic: !this.state.ProfilePic,
        });
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
                    toggleModal={() => this.toggleModal()}
                />

                {this.state.ProfilePic && <Uploader />}
            </Fragment>
        );
    }
}
