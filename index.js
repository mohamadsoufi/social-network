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
const { sendEmail } = require("./src/ses");
const csurf = require("csurf");
const { hash, compare } = require("./bc.js");
const cookieSession = require("cookie-session");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

//socket setup

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
app.use(cookieSessionMiddleware);

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

module.exports = { app };

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
    // console.log("req.body :", req.body);
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
                        // console.log("text inside add code to db:", text);
                        ses.sendEmail(to, text, subj)
                            .then((resp) => {
                                // console.log("resp in send email :", resp);
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
        let { first, last, bio, profile_pic, id } = rows[0];
        res.json({ first, last, bio, profile_pic, id });
    });
});

app.get("/user/:id.json", async (req, res) => {
    const { id } = req.params;
    const data = db.getUser(id);
    res.json(await data);
});

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    const { filename } = req.file;
    const url = s3Url + filename;
    db.addUserPic(url, req.session.userId).then(({ rows }) => {
        res.json(rows[0].profile_pic);

        // res.json({rows[0].url})
    });
});

app.post("/update-bio", function (req, res) {
    db.updateBio(req.body.text, req.session.userId).then(({ rows }) => {
        let { bio, id } = rows[0];
        res.json({ bio, id, success: true });
    });
});

app.get("/recent-users", async (req, res) => {
    try {
        const { rows } = await db.getRecentUsers();

        res.json(rows);
    } catch (error) {
        console.log("error in users :", error);
    }
});

app.get("/users/:userInput.json", async (req, res) => {
    const { userInput } = req.params;
    try {
        const { rows } = await db.getUsers(userInput);

        res.json(rows);
    } catch (error) {
        console.log("error in users :", error);
    }
});

app.get("/check-friendship/:id", async (req, res) => {
    try {
        let viewedUserId = req.params.id;
        let profileOwnerId = req.session.userId;

        let { rows } = await db.checkFriendship(viewedUserId, profileOwnerId);
        if (rows.length == 0) {
            res.json({ text: "add" });
        } else if (rows[0].accepted === false) {
            if (rows[0].recipient_id === profileOwnerId) {
                res.json({ text: "cancel" });
            } else {
                res.json({ text: "accept" });
            }
        } else if (rows[0].accepted === true) {
            res.json({ text: "unfriend" });
        }
    } catch (error) {
        console.log("error in check friendship / GET :", error);
    }
});

app.post("/check-friendship", async (req, res) => {
    try {
        let btnText = req.body.text;
        let viewedUserId = req.body.id;
        let profileOwnerId = req.session.userId;
        if (btnText === "add") {
            let { rows } = await db.sendFriendshipReq(
                viewedUserId,
                profileOwnerId
            );

            if (rows[0].accepted === false) {
                res.json({ text: "cancel" });
            }
        } else if (btnText == "cancel" || btnText == "unfriend") {
            try {
                let { rows } = await db.deleteFriendship(
                    viewedUserId,
                    profileOwnerId
                );

                if (rows.length == 0) {
                    res.json({ text: "add" });
                }
            } catch (error) {
                console.log("error in check-friendship/ Post cancel:", error);
            }
        } else if (btnText == "accept") {
            try {
                await db.updateFriendship(viewedUserId, profileOwnerId, true);
                res.json({ text: "unfriend" });
            } catch (error) {
                console.log("error in check-friendship accept/ Post :", error);
            }
        }
    } catch (error) {
        console.log("error in check friendship / POST :", error);
    }
});

app.get("/friends-wannabes", async (req, res) => {
    try {
        const { rows } = await db.getFriends(req.session.userId);
        // console.log("rows in get friends :", rows);
        res.json(rows);
    } catch (error) {
        console.log("error in freinds-wannabes/GET :", error);
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

server.listen(8080, function () {
    console.log("I'm listening.");
});

//socket routes
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async (socket) => {
    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect();
    }

    socket.on("chatMessage", async (data) => {
        await db.addMessageById(userId, data);
        let { rows } = await db.getUserById(userId);
        io.emit("chatMessage", rows[0]);
    });
    try {
        let { rows } = await db.getMessages();
        rows.unshift({ userId });
        socket.emit("chatMessages", rows);
    } catch (error) {
        console.log("error in socket :", error);
    }
});
