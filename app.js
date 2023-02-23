//jshint esversion:6
require("dotenv").config(); // zazadavam dotenv configuraci
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { ///funguje to jen s ip adresou kdzy je pouyita verye 18 +++

useNewUrlParser: true,

useUnifiedTopology: true

}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});


const UserSchema = new mongoose.Schema( {  /// ted jsem z toho udelal object pouzivani v mongoos schema
  email: String,
  password: String,
});

 /// klic podle ktereho se tvori encrypce hesla/// do souboru .env davam  // zde byl klic /// process.env.SECRET timto ho spoustim a musim mit nadefinovano v .env co to je to SECRET
UserSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); /// enript podle user userSchema coz je novej monoose. Schema pole password. a coduje pokazde kdzy das save noveho zaznamu a dekodovava kdzy das find.

const User = new mongoose.model("User", UserSchema);



app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,

    });
 newUser.save(function(err){
   if(!err){
     console.log("ulozeno zaznam email a password");
     res.render("secrets");
   } else {
     console.log(err);
   }
 });
});


app.post("/login", function(req, res){
  const username = req.body.username; /// tz budes datlovat user name a heslo coz tato konstanta to resi
  const password = req.body.password; /// tadz zase davam do konstanty heslo co nadatluju a zmacku button
  User.findOne({email: username}, function(err,foundUser){  /// najid one podle emailu kterz je username je to uz prvni kontrola toho ze jsi blbe nadatloval email

    if (foundUser.password === password){  /// pokud jsem dobre nasel email tedz dobre nadatloval user name a mam ho uz v databasi tak je cas na provereni hesla foundUser.password // nasel jsem podle hesla a davam ho do shodz s nadatlovanym heslem
      console.log("nasel jsem shodu Jsi logovanej");
      res.render("secrets");

    }else {
      console.log("nenasel jsem shodu nejsi logovanej");
    }
  });


});







app.listen(3000, function() {   /// ted menim na Heroku portlal tim ze davam port protoze nahore mam podminku
  console.log("Server started on port 3000");
});
