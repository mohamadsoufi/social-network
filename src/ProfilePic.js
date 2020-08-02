import React, { Fragment } from "react";

const styles = {
    image: {
        width: "100px",
        height: "100px",
    },
    // wrapper: {
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "spaceBetween",
    // },
};

export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    let { first, last, imgUrl } = props;
    // imgUrl = imgUrl || "/img/default.png";

    return (
        <Fragment>
            {/* <img src="/public/logo.png" style={styles.image} alt="logo" /> */}
            <img
                onClick={props.toggleModal}
                src={imgUrl}
                style={styles.image}
                alt={first}
            />

            {/* <div onClick={props.iAmAMethodInApp}>
                    I am the ProfilePic {first} {last}
                </div>
                <img src={imgUrl} alt={first} /> */}
        </Fragment>
    );
}
