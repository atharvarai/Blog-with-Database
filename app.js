//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const homeStartingContent = "Blog keeping app is an online platform that allows users to create, publish, and manage their own blog posts. The app provides a user-friendly interface where users can easily create new blog posts by giving them a title and adding a description or content to them. The app also includes a database to store all the posts created by the users, allowing them to access and view their posts at any time.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
dotenv.config();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.vcxcyzp.mongodb.net/Blog`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const postSchema = mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);


app.get('/', function (req, res) {
    Post.find({}, function (err, foundPosts) {
        if (!err) {
            res.render('home.ejs', { startingContent: homeStartingContent, posts: foundPosts });
        }
    });
});

app.get('/about', function (req, res) {
    res.render('about.ejs', { aboutContent: aboutContent });
});

app.get('/contact', function (req, res) {
    res.render('contact.ejs', { contactContent: contactContent });
});

app.get('/compose', function (req, res) {
    res.render('compose.ejs');
});

app.post('/compose', function (req, res) {

    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
    });
    post.save();

    res.redirect('/');
});

app.get('/posts/:postId', function (req, res) {
    const requestedId = req.params.postId;
    Post.findOne({ _id: requestedId }, function (err, postFound) {
        if (!err) {
            res.render("post.ejs", { title: postFound.title, content: postFound.content });
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});