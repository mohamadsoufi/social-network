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
    console.log("req.body :", req.body);
    let { email, password } = req.body;

    db.getUserInfo(email, password)
        .then(({ rows }) => {
            let hashedPw = rows[0].password;
            let id = rows[0].id;

            compare(password, hashedPw)
                .then((matchValue) => {
                    if (matchValue) {
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
    // res.json({ step: 1 });
    console.log("email in reset pw :", req.body.email);
    db.getUserInfo(req.body.email)
        .then(({ rows }) => {
            if (rows[0].length !== 0) {
                let to = rows[0].email;
                // console.log("to :", typeof to);
                let text = secretCode;
                let subj = "Your Application Has Been Accepted!";
                db.addCodeAndEmail(text, to)
                    .then(() => {
                        ses.sendEmail(to, text, subj)
                            .then((resp) => {
                                console.log("resp in send email :", resp);
                                res.json({ step: 2 });
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
        .check((err) => {
            console.log("err in get user info /reset pw:", err);
        });
    //   res.send('POST request to the homepage')
});

app.post("/check-code", (req, res) => {
    console.log("req.body in check code :", req.body);
    // let { code, password } = req.body;
    //   res.send('GET request to the homepage')
});

app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
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
