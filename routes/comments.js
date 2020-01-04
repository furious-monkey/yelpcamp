var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

router.get("/:commentID/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findOne({ _id: req.params.commentID }, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campgroundID: req.params.id,
        comment: foundComment
      });
    }
  });
});

router.put("/:commentID", middleware.checkCommentOwnership, (req, res) => {
  Comment.findOneAndUpdate(
    { _id: req.params.commentID },
    req.body.comment,
    err => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

router.delete("/:commentID", middleware.checkCommentOwnership, (req, res) => {
  Comment.findOneAndDelete({ _id: req.params.commentID }, err => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// function checkCommentOwnership(req, res, next) {
//   if (req.isAuthenticated()) {
//     Comment.findById(req.params.commentID, (err, foundComment) => {
//       if (err) {
//         res.redirect("back");
//       } else {
//         if (foundComment.author.id.equals(req.user._id)) {
//           next();
//         } else {
//           res.redirect("back");
//         }
//       }
//     });
//   } else {
//     res.redirect("back");
//   }
// }

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

module.exports = router;
