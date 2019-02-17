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


//add article to saved page
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


//remove article from saved page
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

//show and add comments for article selected
$(".add-note").on("click", function(event) {
  $(".comment-body").empty()
  $(".comment-list").empty()
  $(".text-input").empty()
  var thisId = $(this).attr("data-id");
  
  $.ajax({
    method: "GET",
    url: "/saved/" + thisId
  }).then(function(data) {
    // console.log(data)
    // console.log(data.note[0].body)
    $(".comment-body").append(`<p><strong>${data.title}</strong></p>`)

    if(!data.note) {
      // var notes = data.note
      // for(let i=0; i < notes.length; i++){
      //   $(".comment-list").append(`<li>${notes[i].body}</li>`)
      // }

      $(".comment-body").append(`<p>There are currently no comments for this article</p>`)
    
    } else {

      var notes = data.note
      for(let i=0; i < notes.length; i++){
        $(".comment-list").append(`<li>${notes[i].body}</li>`)
      }
      // $(".comment-body").append(`<p>There are currently no comments for this article</p>`)
    }

    $(".text-input").append("<textarea id='commentinput' name='comment'></textarea>");

    $(".text-input").append("<button class='waves-effect waves-light btn btn-flat' data-id='" + data._id + "' id='saveComment'>Save Comment</button>");
    
  })
})


//add note to article
  $(document).on("click", "#saveComment", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/saved/" + thisId,
      data: {
        body: $("#commentinput").val()
      }
    })
    .then(function(data){
      console.log("data: ",data)

      $(".comment-list").empty()
      var notes = data.note
      for(let i=0; i < notes.length; i++){
        $(".comment-list").append(`<li>${notes[i].body}</li>`)
      }
    })

    $("#commentinput").val("")
  })

});
