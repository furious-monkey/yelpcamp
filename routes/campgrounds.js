var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
  Campground.find({}, (err, camps) => {
    err ? console.log(err) : res.render("campgrounds/index", { camps: camps });
  });
});

router.post("/", isLoggedIn, function(req, res) {
  var name = req.body.name;
  var img = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcamp = { name: name, image: img, description: desc, author: author };
  Campground.create(newcamp, (err, camp) => {
    err ? console.log(err) : console.log(camp);
  });
  res.redirect("/campgrounds");
});

router.get("/new", isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, ret) => {
      err ? console.log(err) : res.render("campgrounds/show", { camps: ret });
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
