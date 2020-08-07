import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(props) {
    const [buttonText, setButtonText] = useState({});
    const [trackText, setTrackText] = useState({});
    const [notification, setNotification] = useState({ not: false });

    let { id } = props;

    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    let { data } = await axios.get(`/check-friendship/${id}`);
                    // console.log("data.text  in mounted:", data.text);
                    if (data.text) {
                        setButtonText(data);
                        if (data.text === "accept") {
                            setNotification({ not: true });
                        }
                    }
                }
            } catch (error) {
                console.log("error :", error);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                let info = {
                    text: buttonText.text,
                    id: id,
                };
                if (info.text) {
                    let { data } = await axios.post("/check-friendship", info);
                    setButtonText(data);
                    if (data.text === "accept") {
                        setNotification({ not: true });
                    }
                }
            } catch (error) {
                console.log("error in recent-users/ client :", error);
            }
        })();
    }, [trackText]);

    const handleChange = (e) => {
        setTrackText(buttonText.text);
    };

    if (buttonText) {
        if (notification.not) {
            return (
                <>
                    <button onClick={handleChange}>{buttonText.text}</button>
                    <img className="new-friend-icon" src="../follow.png" />
                </>
            );
        }

        return (
            <>
                <button onClick={handleChange}>{buttonText.text}</button>
            </>
        );
    }
}
