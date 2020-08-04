import React from "react";
import ProfilePic from "./ProfilePic";
import { BioEditor } from "./BioEditor";

export function Profile(props) {
    let { imgUrl, first, last, id, bio, toggleModal } = props;
    console.log("bio in profile:", bio);
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
                    {/* <img
                        className="profile-large-img"
                        src={imgUrl}
                        alt={(first, last)}
                    /> */}
                    {/* pass the class from the parent <<<<<<<<<<<<<<<<<*/}
                    <ProfilePic
                        className="profile-large-img"
                        first={first}
                        last={last}
                        imgUrl={imgUrl}
                        onClick={toggleModal}
                    />
                </div>
            </div>
        </div>
    );
}
