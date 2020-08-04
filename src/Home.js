import React, { Component, Fragment } from "react";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import { Profile } from "./Profile";
import { OtherProfile } from "./OtherProfile";
import { BrowserRouter, Route } from "react-router-dom";

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
            bio: "",
            id: null,
        };
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data: { first, last, bio, profile_pic, id } }) => {
                this.setState({
                    first: first,
                    last: last,
                    imgUrl: profile_pic,
                    id: id,
                    bio: bio,
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

    setBio(e) {
        this.setState({ bio: e });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="header">
                    <div>
                        <img src="/logo.png" style={styles.image} alt="logo" />
                    </div>
                    <div className="header-right">
                        <div className="header-titles">
                            <a className="header-links" href="/logout">
                                log out
                            </a>
                        </div>
                        <ProfilePic
                            profilePicSize="profile-pic-small"
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                            toggleModal={() => this.toggleModal()}
                        />
                    </div>
                </div>

                <div className="upload-file-container">
                    {this.state.ProfilePic && (
                        <Uploader
                            imgUrl={this.state.imgUrl}
                            toggleModal={() => this.toggleModal()}
                            updateUrl={(e) => this.updateUrl(e)}
                        />
                    )}
                </div>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                            id={this.state.id}
                            bio={this.state.bio}
                            setBio={(e) => this.setBio(e)}
                            toggleModal={() => this.toggleModal()}
                        />
                    )}
                />
                <Route path="/user/:id" component={OtherProfile} />
            </BrowserRouter>
        );
    }
}
