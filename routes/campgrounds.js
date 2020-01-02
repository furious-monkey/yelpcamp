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

router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

router.put("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findOneAndUpdate(req.params.id, req.body.campground, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

router.delete("/:id", checkCampgroundOwnership, (req, res) => {
  Campground.findOneAndDelete(req.params.id, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
