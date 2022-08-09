require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const lodash = require('lodash');

mongoose.connect(process.env.MONGO_ID);
// mongoose.connect("mongodb://localhost:27017");

const posts = [];

const postsSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postsSchema);

const homeStartingContent = "Welcome to the Journad App. Click on compose to add your daily journal.";
const aboutContent = "This app was created by Shubham";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

// app.route("/compose")                   /// Using this express route method, code becomes less repetitive
//   .get(function(req, res){
//     res.render("compose");
//   })
//   .post(function(req, res){
//     const post = {postTitle: req.body.postTitle, postBody: req.body.postBody};
//     posts.push(post);
//     res.redirect("/");
//   });

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save(function(err){
    if(!err)
      res.redirect("/");
    });
});

app.get("/posts/:postName", function(req, res){
  Post.find({}, function(err, posts){
    posts.forEach(function(post){
      if(lodash.lowerCase(req.params.postName) === lodash.lowerCase(post.title)){
        res.render("post", {post: post});
      }
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
