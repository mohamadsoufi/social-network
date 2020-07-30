const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");

// let csurf = require("csurf");

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

// app.use(csurf());

// module.exports = { app }
// app.use(function (req, res, next) {
//     res.setHeader("x-frame-options", "deny");
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

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
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
