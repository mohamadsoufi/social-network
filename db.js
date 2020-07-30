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

module.exports.getUserInfo = (email) => {
    let q = `SELECT * FROM users
            WHERE  users.email = $1`;
    let params = [email];
    return db.query(q, params);
};

module.exports.addCodeAndEmail = (params) => {
    let q = `INSERT INTO password_reset_codes
             (code, email)
             VALUES ($1, $2)'`;
    return db.query(q, params);
};

module.exports.checkCode = () => {
    let q = `SELECT * FROM password_reset_codes
            WHERE
 CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    return db.query(q);
};
