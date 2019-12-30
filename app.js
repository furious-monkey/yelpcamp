var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user');
// seedDB = require('./seeds');

// seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Passport CONFIG
app.use(require('express-session')({
    secret: 'im the man',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============================Routes================================//
app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, (err, camps) => {
        err ? console.log(err) : res.render("campgrounds/index", { camps: camps })
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
    res.render("campgrounds/new")
});

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate('comments').exec((err, ret) => {
        err ? console.log(err) : res.render('campgrounds/show', { camps: ret });
    });
});

//=======================================================
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);

        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            });
        }
    });
});
//=======================================================
//Register ROUTES
app.get("/register", function (req, res) {
    res.render('register');
});

app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register')
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/campgrounds');
            });
        }
    });
});
//Login ROUTES
app.get("/login", function (req, res) {
    res.render('login')
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {
});

app.listen(process.env.PORT || 3000, process.env.IP || '127.0.0.1', function () {
    console.log("Filluam djema!");
});