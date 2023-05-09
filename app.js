//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret="thisisourlittlesecret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);




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

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  const newUser = new User({
      email:req.body.username,
      password:req.body.password
  });

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}).then(function(foundUser)
  {
      if(foundUser){
          if(foundUser.password === password){
              res.render("Aregister");
          }
      }
      else{
          newUser.save().then(function(){
              res.render("compose");
          }).catch(function(error){
              console.log(error);
          });
      }
  }).catch(function(error){
      console.log(error);
  })

  
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
