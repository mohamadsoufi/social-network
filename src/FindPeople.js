import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [userInput, setUserInput] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.get("/recent-users");
                setUsers(data);
            } catch (error) {
                console.log("error in recent-users/ client :", error);
            }
        })();
    }, []);

    useEffect(() => {
        let abort;
        (async () => {
            try {
                if (userInput == "") {
                    setUsers("");
                }
                let { data } = await axios.get(`/users/${userInput}.json`);
                if (!abort) {
                    if (data[0].first) {
                        console.log("data in find people :", data);
                        setUsers(data);
                    }
                }
            } catch (error) {
                console.log("error in users/ client:", error);
            }
        })();
        return () => {
            abort = true;
        };
    }, [userInput]);

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div>
            <h2 className="find-more-people">Find more People</h2>
            <input value={userInput} name="users" onChange={handleChange} />
            {users &&
                users.map((user, i) => {
                    let { first, last, profile_pic, id } = user;
                    return (
                        <div key={i} className="users">
                            <Link to={`/user/${id}`}>
                                <img
                                    className="profile-pic-small"
                                    src={profile_pic}
                                    alt={first}
                                />
                            </Link>
                            <div className="profile-username">
                                <p>
                                    <span>{first}</span> {last}
                                </p>
                            </div>
                        </div>
                    );
                })}
            ;
        </div>
    );
}
