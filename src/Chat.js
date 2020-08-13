import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState();
    const [chatMessages, setChatMessages] = useState();
    const elemRef = useRef();

    const msgs = useSelector(
        (state) => state.chatMessages && state.chatMessages.map((msg) => msg)
    );

    const msg = useSelector(
        (state) => state.chatMessage && state.chatMessage.map((msg) => msg)
    );

    console.log("msg in client :", msg);
    console.log("msgs in client :", msgs);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.scrollHeight;
    }, [chatMessage]);

    useEffect(() => {
        socket.emit("chatMessages", chatMessages);
    }, []);
    const messageMaker = (msg, i) => {
        return (
            <div className="chat-container" key={i}>
                <img className="chat-profile-pic-small" src={msg.profile_pic} />
                <Link to={`/user/${msg.id}`}>
                    <div className="chat-profile-username">
                        <div>
                            <span className="first">{msg.first}</span>
                        </div>
                        <div>
                            <span> {msg.last}</span>
                        </div>
                    </div>
                </Link>

                <div className="chat-profile-msg">
                    <p>{msg.message}</p>
                </div>
                <div className="chat-date">
                    <p>{msg.ts.slice(11, 16)}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            {msgs && msgs.map((msg, i) => messageMaker(msg, i))}
            <div id="chat-messages" ref={elemRef}>
                {msg && msg.map((msg, i) => messageMaker(msg, i))}
            </div>
            <input
                className
                name="chatArea"
                id="chatArea"
                cols="30"
                rows="1"
                onChange={(e) => setChatMessage(e.target.value)}
            ></input>
            <button onClick={() => socket.emit("chatMessage", chatMessage)}>
                Send
            </button>
        </>
    );
}
