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
import { receiveFriendsWannabes } from "./Redux/actions";

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

const mapDispatchToProps = (dispatch) => ({
    receiveFriendsWannabes: () => {
        dispatch(receiveFriendsWannabes());
    },
});
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProfilePic: false,
            imgUrl: "",
            bio: "",
            id: null,
            classN: "header",
            headerTitles: "header-titles",
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
                    classN: "header",
                });
            })
            .catch((err) => {
                console.log("err in get /user: ", err);
            });

        this.props.receiveFriendsWannabes();
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        if (window.scrollY > 0) {
            this.setState({
                classN: "header-y",
                headerTitles: "header-titles-a",
            });
        } else {
            this.setState({ classN: "header", headerTitles: "header-titles" });
        }
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
                <div className={this.state.classN}>
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
                        <div className={this.state.headerTitles}>
                            {this.props.wannabes && (
                                <div>
                                    {this.props.wannabes.length > 0 && (
                                        <div className="notification-container">
                                            <img
                                                className="new-friend-icon"
                                                src="../follow.png"
                                            />
                                            {this.props.wannabes && (
                                                <p className="notification-num">
                                                    {this.props.wannabes.length}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Link to="/friends">Friends</Link>
                            <Link to="/chat">Chat</Link>
                            <Link to="/users">Find Friends</Link>
                            <a className="header-links" href="/logout">
                                Log Out
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);
