var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/campgrounds", function(req, res) {
  Campground.find({}, (err, camps) => {
    err ? console.log(err) : res.render("campgrounds/index", { camps: camps });
  });
});

router.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var img = req.body.image;
  var desc = req.body.description;
  var newcamp = { name: name, image: img, description: desc };
  Campground.create(newcamp, (err, camp) => {
    err ? console.log(err) : console.log(camp);
  });
  res.redirect("/campgrounds");
});

router.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, ret) => {
      err ? console.log(err) : res.render("campgrounds/show", { camps: ret });
    });
});

module.exports = router;
