var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//routes

app.get("/scrape", function(req, res) {

    axios.get("https://www.npr.org/sections/news/")
        .then(function(response) {
            var $ = cheerio.load(response.data);

            $(".item-info").each(function(i, element) {
                var result = {};
                // console.log(element);

                result.title = $(this)
                .children("h2.title")
                .text();

                result.link = $(this)
                .find("h2")
                .children("a")
                .attr("href");

                result.summary = $(this)
                .children("p.teaser")
                .text()

                db.Article.create(result)
                    .then(function(dbentry) {
                        console.log(dbentry)
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");
        });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      
        var articleObject = {
            articles: dbArticle
        }
        console.log(articleObject);

      res.render("index", articleObject);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});





app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });