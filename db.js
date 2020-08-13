const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/sosialnetwork"
);

module.exports.addUserInfo = (first, last, email, password) => {
    let q = ` INSERT INTO users (first, last, email, password)
            VALUES ($1,$2,$3,$4)
            RETURNING id`;
    let params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.addUserPic = (url, id) => {
    let q = ` UPDATE users
            SET profile_pic = $1
            WHERE id = $2
            RETURNING profile_pic, id`;
    let params = [url, id];
    return db.query(q, params);
};

module.exports.updateBio = (bio, id) => {
    let q = ` UPDATE users
            SET bio = $1
            WHERE id = $2
            RETURNING bio, id`;
    let params = [bio, id];
    return db.query(q, params);
};

module.exports.getRecentUsers = () => {
    let q = "  SELECT * FROM users ORDER BY id DESC LIMIT 3";
    return db.query(q);
};

module.exports.getUsers = (val) => {
    let q = `SELECT * FROM users WHERE first ILIKE $1`;
    let params = [val + "%"];
    return db.query(q, params);
};

module.exports.checkFriendship = (viewedUserId, profileOwnerId) => {
    let q = `SELECT * FROM friendships
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)`;
    let params = [viewedUserId, profileOwnerId];
    return db.query(q, params);
};

module.exports.sendFriendshipReq = (profileOwnerId, viewedUserId) => {
    let q = `INSERT INTO friendships
             (sender_id, recipient_id)
             VALUES ($1, $2)
             RETURNING *`;
    let params = [viewedUserId, profileOwnerId];
    return db.query(q, params);
};

module.exports.updateFriendship = (viewedUserId, profileOwnerId, val) => {
    let q = `UPDATE friendships
            SET accepted = $3
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1)`;
    let params = [viewedUserId, profileOwnerId, val];
    return db.query(q, params);
};

module.exports.deleteFriendship = (viewedUserId, profileOwnerId) => {
    let q = `DELETE FROM friendships
             WHERE (recipient_id = $1 AND sender_id = $2)
             OR (recipient_id = $2 AND sender_id = $1)`;
    let params = [viewedUserId, profileOwnerId];
    return db.query(q, params);
};

module.exports.getFriends = (id) => {
    let q = `SELECT users.id, first, last, profile_pic, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    let params = [id];
    return db.query(q, params);
};

module.exports.getUserInfo = (email) => {
    let q = `SELECT * FROM users
            WHERE email = $1`;
    let params = [email];
    return db.query(q, params);
};

module.exports.getUser = (id) => {
    let q = `SELECT * FROM users
            WHERE id = $1`;
    let params = [id];
    return db.query(q, params);
};

module.exports.addCodeAndEmail = (params) => {
    let q = `INSERT INTO password_reset_codes
             (code, email)
             VALUES ($1, $2)`;
    return db.query(q, params);
};

module.exports.checkCode = (params) => {
    let q = `SELECT * FROM password_reset_codes
            WHERE email = $1
            AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            ORDER BY created_at DESC
            LIMIT 1`;
    return db.query(q, params);
};

module.exports.updatePassword = function (hashedPw, email) {
    let q = `UPDATE users 
             SET password =$1
             WHERE email = $2 `;
    let params = [hashedPw, email];
    return db.query(q, params);
};

// SOCKET

module.exports.getUserById = (sender_id) => {
    let q = `SELECT * FROM chat_messages
           JOIN users
            ON (sender_id = $1 AND users.id = $1)
            ORDER BY ts DESC
            LIMIT 1`;
    return db.query(q, [sender_id]);
};

module.exports.addMessageById = (sender_id, msg) => {
    let q = `INSERT INTO chat_messages
             (sender_id, message)
             VALUES ($1, $2)`;
    return db.query(q, [sender_id, msg]);
};

module.exports.getMessages = () => {
    let q = `SELECT * FROM chat_messages
           JOIN users
            ON (sender_id = users.id)
            ORDER BY ts DESC
            LIMIT 10`;
    return db.query(q);
};
