var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// <%- include("partials/header") %>

app.use(bodyParser.urlencoded({ extende: true }));
app.set('view engine', 'ejs');

var campgrounds = [
    { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg" },
    { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
    { name: "Montain Goat's Rest", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg" },
    { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg" },
    { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
    { name: "Montain Goat's Rest", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg" },
    { name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg" },
    { name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_960_720.jpg" },
    { name: "Montain Goat's Rest", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg" }
]

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", { camps: campgrounds })
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var newcamp = { name: name, image: img }
    campgrounds.push(newcamp);
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs")
});

app.listen(process.env.PORT || 3000, process.env.IP || '127.0.0.1', function () {
    console.log("Filluam djema!");
});