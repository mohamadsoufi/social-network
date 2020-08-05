import React, { Component } from "react";
import axios from "./axios";
import ProfilePic from "./ProfilePic";

export class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            bio: "",
            imgUrl: "",
        };
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const { data } = await axios.get(`/user/${id}.json`);
        let { profile_pic, first, last, bio } = data.rows[0];
        this.setState({
            imgUrl: profile_pic,
            first: first,
            last: last,
            bio: bio,
        });
    }

    render() {
        return (
            <div>
                <div className="profile-content-container">
                    <div className="profile-username">
                        <p>
                            {this.state.first}
                            {this.state.last}
                        </p>
                        <h2>{this.state.bio}</h2>
                    </div>

                    <div className="profile-right-side">
                        <ProfilePic
                            profilePicSize="profile-pic-large"
                            first={this.state.first}
                            last={this.state.first}
                            imgUrl={this.state.imgUrl}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
