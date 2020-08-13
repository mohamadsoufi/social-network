import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import { Profile } from "./Profile";
import { OtherProfile } from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./Chat";

import axios from "./axios";
import { connect } from "react-redux";

//using Redux with class:
//use mapStateToProps then connect
function mapStateToProps(state) {
    return {
        wannabes:
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => {
                if (friend.accepted === false) {
                    return friend;
                } else {
                    return null;
                }
            }),
    };
}
class Home extends Component {
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
                        <Link to="/">
                            <img
                                src="/logo.png"
                                className="profile-pic-small"
                                alt="logo"
                            />
                        </Link>
                    </div>
                    <div className="header-right">
                        <div className="header-titles">
                            {this.props.wannabes && (
                                <div>
                                    {!!this.props.wannabes.length && (
                                        <img
                                            className="new-friend-icon"
                                            src="../follow.png"
                                        />
                                    )}
                                </div>
                            )}
                            <Link to="/chat">chat</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/users">Find friends</Link>
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
                <Route path="/users/" component={FindPeople} />
                <Route path="/friends/" component={Friends} />
                <Route path="/chat/" component={Chat} />
            </BrowserRouter>
        );
    }
}
export default connect(mapStateToProps)(Home);
