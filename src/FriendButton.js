import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(props) {
    const [buttonText, setButtonText] = useState({});
    const [trackText, setTrackText] = useState({});

    let { id } = props;

    useEffect(() => {
        (async () => {
            try {
                if (id) {
                    let { data } = await axios.get(`/check-friendship/${id}`);
                    if (data.text) {
                        setButtonText(data);
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
                    id,
                };
                if (info.text) {
                    let { data } = await axios.post("/check-friendship", info);
                    setButtonText(data);
                }
            } catch (error) {
                console.log("error in recent-users/ client :", error);
            }
        })();
    }, [trackText]);

    const handleChange = () => {
        setTrackText(buttonText.text);
    };

    if (buttonText) {
        return <button onClick={handleChange}>{buttonText.text}</button>;
    }
}
