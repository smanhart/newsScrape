var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = process.env.PORT || 3000;

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

app.get("/", function(req, res) {
    
    res.redirect("/articles")
});

//scrape news site for articles
app.get("/scrape", function(req, res) {

    axios.get("https://www.npr.org/sections/news/")
        .then(function(response) {
            var $ = cheerio.load(response.data);

            $("article.item.has-image").each(function(i, element) {
                var result = {};
                // console.log(element);

                result.picture = $(this)
                .children(".item-image")
                .find("img")
                .attr("src")

                // result.credit = $(this)
                // .children(".item-image")
                // .find("span.credit")
                // .text();

                result.title = $(this)
                .children(".item-info-wrap")
                .find("h2.title")
                .text();

                result.link = $(this)
                .find("h2")
                .children("a")
                .attr("href");

                result.summary = $(this)
                .children(".item-info-wrap")
                .find("p.teaser")
                .text()

                console.log(result)

                db.Article.create(result)
                    .then(function(dbentry) {
                        // console.log(dbentry)
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");
        });
});

//find all articles in database
app.get("/articles", function(req, res) {
    
    db.Article.find({}).sort({date: -1})
    .then(function(dbArticle) {
      
        var articleObject = {
            articles: dbArticle
        }
        // console.log(articleObject);
      res.render("index", articleObject);
        // res.json(articleObject);
        // res.redirect("/", articleObject);

        // res.json(dbArticle)
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

//delete all articles in database
app.delete("/clear", function(req, res) {
    db.Article.deleteMany({})
    .then(function() {
        res.end()
    })
})

//get all articles marked as saved
app.get("/saved", function(req, res) {
    db.Article.find({})
    .then(function(dbSavedArticle) {

        var savedArticleObj = {
            savedArticle: dbSavedArticle
        }
        console.log(savedArticleObj);
        res.render("saved", savedArticleObj)
    })
    .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
})

//update saved status on article
app.put("/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: req.body.isSaved })
    .then(function(result) {

        res.send("Entry Updated")
    })
    
    
})

//get article by id and populate with note
app.get("/saved/:id", function(req, res) {
    console.log("Server side id", req.params.id)
    db.Article.findById(req.params.id )
      .populate("note")
      .then(function(dbSavedWithNote) {

        // var savedWithNoteObj = {
        //     savedWithNote: dbSavedWithNote
        // }
        
        // res.render("saved", savedWithNoteObj)
        // console.log(dbSavedWithNote)
          res.json(dbSavedWithNote)
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
})

//creates note in Note db, then links with Article db
app.post("/saved/:id", function(req, res) {
    console.log("req.body", req.body)
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate(
            {_id:req.params.id}, 
            { $push: { note: dbNote._id }}, 
            { new: true })
            .populate("note")
    })
    
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
})




app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });