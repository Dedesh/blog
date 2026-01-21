import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(3000, () => {
    console.log(`Server listening on port ${port}.`)
});

const blogPosts = {}

const colorList = ["#F43D3D", "#F45A3D", "#F4783D", "#F4963D", "#F4A83D", "#F4BD3D",
                    "#99c759ff", "#29a537ff", "#37bcda", "#3D90F4", "#3D52F4",
                    "#853DF4", "#C03DF4", "#F43DF4", "#F43D9F"];

function decideColors() {
    const colorSequence = [];
    for (let post in blogPosts) {
        let randomColor = colorList[Math.floor(Math.random() * colorList.length)];
        colorSequence.push(randomColor)
    };
    return colorSequence;
};

app.get("/", (req, res) => {
    res.render("pages/login");
});

app.post("/submit-id", (req, res) => {
    let userId = req.body.id;

    if (userId.length < 4) {
        res.render("pages/login");
    } else {
        res.render("pages/home", {
        id: userId, blogPosts, colors: decideColors()
        });
    }
});

app.get("/write-post", (req, res) => {
    let userId = req.query.userId;

    if (!userId) {
        res.render("pages/login");
    } else {
        let firstTry = true;
        res.render("pages/write", {
        id: userId, firstTry
        });
    };
});

app.post("/create-post", (req, res) => {
    let userId = req.body.userId;
    let postTopic = req.body.topic;
    let postText = req.body.text;
    let oldTopic = req.body.oldTopic;
    let isEditing = oldTopic != undefined && oldTopic != null;
    if (!postTopic || !postText) {
        let firstTry = false;
        res.render("pages/write", {
            id: userId, topic: postTopic, text: postText, firstTry, oldTopic, isEditing
        });
    } else {
        if (oldTopic) {
            delete blogPosts[oldTopic];
        };
        blogPosts[postTopic] = [postText, userId];
        res.render("pages/home", {
            id: userId, blogPosts, colors: decideColors()
        });
    };
});

app.post("/edit-post", (req, res) => {
    let oldTopic = req.body.oldTopic;
    let postText = blogPosts[oldTopic][0];
    let userId = blogPosts[oldTopic][1];
    let isEditing = true;
    res.render("pages/write", {
        id: userId, topic: oldTopic, text: postText, isEditing, oldTopic
    });
});

app.post("/delete-post", (req, res) => {
    let userId = req.body.userId
    let topicToDelete = req.body.oldTopic;
    delete blogPosts[topicToDelete];
    res.render("pages/home", {
        id: userId, blogPosts, colors: decideColors()
    });
});
