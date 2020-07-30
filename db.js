const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/sosialnetwork");


module.exports.addUserInfo = (first, last, email, password) => {
    let q = ` INSERT INTO users (first, last, email, password)
            VALUES ($1,$2,$3,$4)
            RETURNING id`;
    let params = [first, last, email, password];
    return db.query(q, params);
};
