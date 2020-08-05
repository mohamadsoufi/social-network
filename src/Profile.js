import React from "react";
import ProfilePic from "./ProfilePic";
import { BioEditor } from "./BioEditor";

export function Profile(props) {
    let { imgUrl, first, last, id, bio, toggleModal } = props;
    // console.log("bio in profile:", bio);
    // console.log("id in profile:", id);
    imgUrl = imgUrl || "../user.png";

    return (
        <div>
            <div className="profile-content-container">
                <div className="profile-username">
                    <p>
                        {first}
                        {last}
                    </p>
                </div>
                <BioEditor
                    first={first}
                    id={id}
                    bio={bio}
                    setBio={props.setBio}
                />
                <div className="profile-right-side">
                    <ProfilePic
                        profilePicSize="profile-pic-large"
                        first={first}
                        last={last}
                        imgUrl={imgUrl}
                        toggleModal={toggleModal}
                    />
                </div>
            </div>
        </div>
    );
}
