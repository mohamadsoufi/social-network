import React, { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState();
    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.scrollHeight;
    }, [chatMessage]);

    return (
        <div id="chat-messages" ref={elemRef}>
            <textarea
                name="chatArea"
                id="chatArea"
                cols="30"
                rows="2"
                onChange={(e) => setChatMessage(e.target.value)}
            ></textarea>
            <button onClick={() => socket.emit("chatMessage", chatMessage)}>
                Send
            </button>
        </div>
    );
}
