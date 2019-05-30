// $.getJSON("/articles", (results) => {
//     for (var i = 0; i < results.length; i++){
//         $(".card-image").append("<img src='" + results[i].image + "'>");
//         console.log(results[i])
//     }
// })

$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        console.log(data[i])
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i].title + "'>" + data[i].summary + "</p>");
    }
  });