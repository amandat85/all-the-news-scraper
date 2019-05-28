var cheerio = require("cheerio");
var axios = require("axios");

//Getting information from BBC News World
axios.get("https://www.cbc.ca/news/canada").then(function (response) {
  // console.log(response.data)

  // Load the HTML into cheerio
  var $ = cheerio.load(response.data);

  // Make an empty array for saving our scraped info
  var results = [];

  $("a.card").each((i, element) => {
    //Headline
    let articleTitle = $(element).find($("h3.headline")).text();
    //Article Link
    let articleLink = $(element).attr("href")
    //Article Summary
    let articleSummary = $(element).find($("div.description")).text();
    //Article Image
    let articleImage = $(element).find($("img")).attr("src");
    //Article Section
    let articleDept = $(element).find($("span.departmentItem")).text();

    if (articleTitle && articleLink && articleSummary && articleImage) {
      results.push({
        headline: articleTitle,
        link: articleLink,
        summary: articleSummary,
        image: articleImage,
        dept: articleDept
      });
    }
  });

  // After looping through each element found, log the results to the console
  console.log(results);
});

