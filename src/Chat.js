import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Chat(props) {
    const [chatMessage, setChatMessage] = useState();
    const [chatMessages, setChatMessages] = useState();

    const elemRef = useRef();

    const msgs = useSelector(
        (state) =>
            state.chatMessages &&
            state.chatMessages.sort((a, b) => new Date(a.ts) - new Date(b.ts))
    );

    const id = useSelector((state) => state.id && state.id[0].userId);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.scrollHeight;
    }, [msgs]);

    let changeClass = (msg) => {
        if (msg.id == id) {
            return "user-chat-container";
        } else {
            return "chat-container";
        }
    };

    const enterMsg = (e) => {
        if (e.key === "Enter") {
            socket.emit("chatMessage", chatMessage);
            chatArea.value = "";
        }
    };

    const sendMsg = (e) => {
        e.preventDefault();
        socket.emit("chatMessage", chatMessage);
        chatArea.value = "";
    };

    const messageMaker = (msg, i) => {
        let time = new Date(msg.ts);
        return (
            <div className={changeClass(msg)} key={i}>
                <Link to={`/user/${msg.id}`}>
                    {msg.profile_pic ? (
                        <img
                            className="chat-profile-pic-small"
                            src={msg.profile_pic}
                        />
                    ) : (
                        <img
                            className="chat-profile-pic-small"
                            src="../user.png"
                        />
                    )}
                </Link>

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
                    <p>
                        {time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div id="chat-messages" ref={elemRef}>
                {msgs && msgs.map((msg, i) => messageMaker(msg, i))}
            </div>
            <div className="input-send-container">
                <input
                    type="text"
                    name="chatArea"
                    id="chatArea"
                    onKeyDown={(e) => enterMsg(e)}
                    onChange={(e) => setChatMessage(e.target.value)}
                ></input>
                <button onClick={(e) => sendMsg(e)}>Send</button>
            </div>
        </>
    );
}
