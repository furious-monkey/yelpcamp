var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, (err, camps) => {
        err ? console.log(err) : res.render("index", { camps: camps })
    })
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.description;
    var newcamp = { name: name, image: img, description: desc }
    Campground.create(newcamp, (err, camp) => {
        err ? console.log(err) : console.log(camp);
    });
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs")
});

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate('comments').exec((err, ret) => {
        err ? console.log(err) : res.render('show', { camps: ret });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '127.0.0.1', function () {
    console.log("Filluam djema!");
});