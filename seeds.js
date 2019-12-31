var mongoose = require("mongoose"),
  Campground = require("./models/campground");
// Comment = require('./models/comment');

// var data = [
//     {
//         name: "Cloud's Rest",
//         image: 'https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg',
//         description: 'blah bllah blah'
//     },
//     {
//         name: "Desert Mesa",
//         image: 'https://i0.wp.com/campingseasonsupply.com/wp-content/uploads/2019/07/50.png?w=980&ssl=1',
//         description: 'blah bllah blah'
//     },
//     {
//         name: "Canyon Floor",
//         image: 'https://r-cf.bstatic.com/images/hotel/max1024x768/209/209548648.jpg',
//         description: 'blah bllah blah'
//     }
// ]

function seedDB() {
  //Remove All Campgrounds
  Campground.deleteMany({}, err => {
    console.log(err);
  });

  //Create Campground
  // data.forEach((seed) => {
  //     Campground.create(seed, (err, campground) => {
  //         if (err) {
  //             console.log(err);
  //         }
  //         else {
  //             console.log('Added a campground');
  //             Comment.create({
  //                 text: 'This place is great, but i wish there was internet',
  //                 author: 'Homer'
  //             }, (err, comment) => {
  //                 if (err) {
  //                     console.log(err);
  //                 } else {
  //                     campground.comments.push(comment);
  //                     campground.save();
  //                     console.log('Created a new comment');
  //                 }
  //             });
  //         }
  //     });
  // });
}

module.exports = seedDB;
