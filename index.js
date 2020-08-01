const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");
const ses = require("./src/ses.js");
const cryptoRandomString = require("crypto-random-string");
const secretCode = cryptoRandomString({
    length: 6,
});
const { s3Url } = require("./config.json");
const s3 = require("./s3");

// const { sendEmail } = require("./src/ses");
let csurf = require("csurf");

const { hash, compare } = require("./bc.js");

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(bodyParser.json());

app.use("/public", express.static("./public"));

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

module.exports = { app };
app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

///////////////// MULTER ///////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { get } = require("http");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
////////////////////////

/////ROUTES/////

app.post("/register", (req, res) => {
    console.log("req.body :", req.body);
    if (Object.keys(req.body).length !== 0) {
        let { first, last, email, password } = req.body;
        hash(password)
            .then((hashedPw) => {
                db.addUserInfo(first, last, email, hashedPw)
                    .then((results) => {
                        let id = results.rows[0].id;
                        req.session.userId = id;
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("err in POST /addUserInfo :", err);
                    });
            })
            .catch((err) => {
                console.log("error in POST register", err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/login", function (req, res) {
    let { email, password } = req.body;
    db.getUserInfo(email)
        .then(({ rows }) => {
            let hashedPw = rows[0].password;
            let id = rows[0].id;

            compare(password, hashedPw)
                .then((matchValue) => {
                    if (matchValue) {
                        console.log("matchValue :", matchValue);
                        req.session.userId = id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in compare in POST login:", err);
                });
        })
        .catch((err) => {
            console.log("err in get user info:", err);
        });
});

app.post("/reset-password", function (req, res) {
    db.getUserInfo(req.body.email)
        .then(({ rows }) => {
            if (rows[0].length !== 0) {
                let to = rows[0].email;
                let text = secretCode;
                let subj = "This is your Code.";
                db.addCodeAndEmail([text, to])
                    .then(() => {
                        console.log("text inside add code to db:", text);
                        ses.sendEmail(to, text, subj)
                            .then((resp) => {
                                console.log("resp in send email :", resp);
                                res.json({ step: true });
                            })
                            .catch((err) => {
                                console.log("err :", err);
                            });
                    })
                    .catch((err) => {
                        console.log("err in add code and email :", err);
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err in get user info /reset pw:", err);
        });
});

app.post("/check-code", (req, res) => {
    let { email, code, password } = req.body;

    db.checkCode([email])
        .then(({ rows }) => {
            let codeInDb = rows[0].code;
            let emailInDb = rows[0].email;
            if (codeInDb === code && email === emailInDb) {
                hash(password)
                    .then((hashedPw) => {
                        db.updatePassword(hashedPw, email)
                            .then(() => {
                                res.json({ step: true });
                            })
                            .catch((err) => {
                                console.log("err in POST /addUserInfo :", err);
                            });
                    })
                    .catch((err) => {
                        console.log("error in POST register", err);
                        res.json({ step: false });
                    });
            } else {
                res.json({ step: false });
            }
        })
        .catch((err) => {
            console.log("err in check code :", err);
        });
});

app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", (req, res) => {
    db.getUser(req.session.userId).then(({ rows }) => {
        let { first, last, bio, profile_pic } = rows[0];
        res.json({ first, last, bio, profile_pic });
    });
});

app.post("/upload", function (req, res) {
    console.log("req.body in upload :", req.body);
    console.log("req.file :", req.file);
    const { filename } = req.file;
    const url = s3Url + filename;
    console.log("url :", url);
    // res.send("POST request to the homepage");
});

app.get("/logout", function (req, res) {
    req.session.userId = null;
    res.redirect("/login");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
