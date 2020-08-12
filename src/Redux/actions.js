import axios from "../axios";

export async function receiveFriendsWannabes() {
    try {
        const { data } = await axios.get("/friends-wannabes");
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data,
        };
    } catch (err) {
        console.log("err in receive friendsWannabes action :", err);
    }
}

export async function acceptFriendRequest(text, id) {
    try {
        let info = {
            text,
            id,
        };
        const { data } = await axios.post("/check-friendship", info);

        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id,
        };
    } catch (err) {
        console.log("err in receive friendsWannabes action :", err);
    }
}

export async function unfriend(text, id) {
    try {
        let info = {
            text,
            id,
        };
        await axios.post("/check-friendship", info);
        return {
            type: "UNFRIEND",
            id,
        };
    } catch (err) {
        console.log("err in receive friendsWannabes action :", err);
    }
}

export async function chatMessages(msgs) {
    try {
        let info = {
            msgs,
        };
        let { data } = await axios.post("/messages", info);
        return {
            type: "CHAT_MESSAGES",
            userId: data.userId,
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        };
    } catch (err) {
        console.log("err in receive friendsWannabes action :", err);
    }
}

export async function chatMessage(msg) {
    try {
        let info = {
            msg,
        };
        let { data } = await axios.post("/message", info);
        return {
            type: "CHAT_MESSAGE",
            data,
        };
    } catch (err) {
        console.log("err in receive friendsWannabes action :", err);
    }
}
