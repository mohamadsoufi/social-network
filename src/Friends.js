import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./Redux/actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => {
                if (friend.accepted === false) {
                    return friend;
                }
            })
    );

    const id = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.id)
    );

    if (!friends || !wannabes) {
        return null;
    }
    const picChecker = (person) => {
        if (person.profile_pic) {
            return person.profile_pic;
        }
        return "../user.png";
    };

    const friendsList = (
        <div className="friends-list">
            <h2>Friends</h2>

            {friends.map((friend, i) => (
                <div key={i}>
                    <Link
                        to={`/user/${friend.id}`}
                        className="user-content-container"
                    >
                        <img
                            className="profile-pic-small"
                            src={picChecker(friend)}
                        />
                        <div className="profile-username">
                            <p>
                                <span>{friend.first}</span> {friend.last}
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={() =>
                            dispatch(unfriend("unfriend", friend.id))
                        }
                    >
                        unfriend
                    </button>
                </div>
            ))}
        </div>
    );

    const wannabesList = (
        <div className="wannabes-list">
            <h2>Friend requests</h2>
            {wannabes.map((wannabe, i) => (
                <div key={i}>
                    <Link
                        to={`/user/${wannabe.id}`}
                        className="user-content-container"
                    >
                        <img
                            className="profile-pic-small"
                            src={picChecker(wannabe)}
                        />
                        <div className="profile-username">
                            <p>
                                <span>{wannabe.first}</span> {wannabe.last}
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={() =>
                            dispatch(acceptFriendRequest("accept", wannabe.id))
                        }
                    >
                        Accept
                    </button>
                    <button
                        className="reject-btn"
                        onClick={() =>
                            dispatch(unfriend("unfriend", wannabe.id))
                        }
                    >
                        reject
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="friends-wannabes-container">
            {!friends.length && (
                <div className="no-friends">You have no friends!</div>
            )}
            {!!friends.length && friendsList}
            {!wannabes.length && (
                <div className="no-friends">no friend request!</div>
            )}
            {!!wannabes.length && wannabesList}
        </div>
    );
}
