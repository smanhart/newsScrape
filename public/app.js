$(function() {

// $.get("/articles", function(data) {

//   // console.log(data)
//   // $("#articles").empty()
//     // For each one
//     for (var i = 0; i < 10; i++) {

//       var card = $("<div>").addClass("card-panel").addClass("teal")

//       var info = $(`<p ${data[i]._id}>${data[i].title}<br />${data[i].link}<br />${data[i].summary}</p>`)

//       var button = $("<button>")

//       $(card).append(info)
//       $("#articles").append(card)

//     //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
//     }
//   });

//scrape new articles from NPR
$(".scrape").on("click", function() {

  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    console.log("Scrape Complete", data);
    location.reload();
  })
})


//clear all articles in the database
$(".clear").on("click", function() {

  $.ajax({
    method: "DELETE",
    url: "/clear"
  }).then(function(data) {
    console.log("Articles Cleared");
    location.reload();
  })
})


$(".save-article").on("click", function(event) {
  event.preventDefault();

  var id = $(this).data("id");
  // var nowSaved = $(this).data("saved");

  console.log(id);
  // console.log(nowSaved)

  var newSaveState = {
    isSaved: true
  };

  // Send the PUT request.
  $.ajax("/saved/" + id, {
    type: "PUT",
    data: newSaveState
  }).then(
    function(data) {
      // Reload the page to get the updated list
      location.reload();
    }
  );
});


$(".unsave-article").on("click", function(event) {
  event.preventDefault();

  var id = $(this).data("id");
  // var nowSaved = $(this).data("saved");

  console.log(id);
  // console.log(nowSaved)

  var newSaveState = {
    isSaved: false
  };

  // Send the PUT request.
  $.ajax("/saved/" + id, {
    type: "PUT",
    data: newSaveState
  }).then(
    function(data) {
      // Reload the page to get the updated list
      location.reload();
    }
  );
});


});
