var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    picture: {
        type: String,

    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    date: {
        date: Date
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;