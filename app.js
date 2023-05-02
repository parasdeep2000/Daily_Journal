//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Website is for blogging made from complete scratch only for the user for there ease of use.It is made for the daily user's journal.Helping them for daily journal...";
const aboutContent = "Simple Blogging web site. For composing new blog we need to go to (/compose). ";
const contactContent = "For reporting any issues or for updating contact me at ";
const app = express();

mongoose.connect("mongodb+srv://admin-paras:Test123@cluster0.g9txaqg.mongodb.net/blogDB");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema={
  title:String,
  content:String
};
const Post = mongoose.model("Post",postSchema);






app.get("/", function(req, res){
  async function postItems(){
    const Items = await Post.find({});
    return Items;
  }

  postItems().then(function(posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save().then(()=>{
    res.redirect("/");
  }).catch((err)=>{
    console.log(err);
  })

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId})
  .then((post)=>{
    res.render("post",{
      title:post.title,
      content:post.content
    });
  });
  
  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
