import React, { Fragment } from "react";

export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    let { first, last, imgUrl } = props;
    imgUrl = imgUrl || "../user.png";

    return (
        <Fragment>
            <img
                className={props.profilePicSize}
                onClick={props.toggleModal}
                src={imgUrl}
                alt={first}
            />
        </Fragment>
    );
}
