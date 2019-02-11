$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < 10; i++) {
      // Display the apropos information on the page
      var card = $("<div>").addClass("card-panel").addClass("teal")

      var info = $(`<p ${data[i]._id}>${data[i].title}<br />${data[i].link}<br />${data[i].summary}</p>`)

      $(card).append(info)
      $("#articles").append(card)

    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
    }
  });