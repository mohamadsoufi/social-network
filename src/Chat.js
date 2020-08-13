import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState();
    const [chatMessages, setChatMessages] = useState();

    const elemRef = useRef();

    const msgs = useSelector(
        (state) => state.chatMessages && state.chatMessages
    );

    const msg = useSelector(
        (state) => state.chatMessage && state.chatMessage.map((msg) => msg)
    );

    const id = useSelector((state) => state.id && state.id[0].userId);
    console.log("id in chat :", id);
    // const userMsgId = () =>
    //     msg.map((msg) => {
    //         console.log("msg.id :", msg.id);
    //     });

    console.log("msg in client :", msg);
    console.log("msgs in client :", msgs);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.scrollHeight;
    }, [chatMessage]);

    useEffect(() => {
        socket.emit("chatMessages");
    }, [chatMessages]);

    let changeClass = (msg) => {
        if (msg.id !== id) {
            return "user-chat-container";
        } else {
            return "chat-container";
        }
    };

    const messageMaker = (msg, i) => {
        return (
            <div className={changeClass(msg)} key={i}>
                {msg.profile_pic ? (
                    <img
                        className="chat-profile-pic-small"
                        src={msg.profile_pic}
                    />
                ) : (
                    <img className="chat-profile-pic-small" src="../user.png" />
                )}
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
