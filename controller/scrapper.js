//**************************************************
//             SCRAPPER AND SCRAPPER ROUTE
//**************************************************/
//Require
//=================================================
//Require node modules
const cheerio = require("cheerio");
const axios = require("axios");

// Require all models
const db = require("../models");

//Scraper
//=================================================
module.exports = (app) => {
	//GET Route for scraped articles
	app.get("/scrape", (req, res) => {
		axios.get("https://www.cbc.ca/news/canada").then(function (response) {
			console.log(response.data)

			// Load the HTML into cheerio
			var $ = cheerio.load(response.data);

			// Make an empty array for saving our scraped info
			var results = {};

			$("a.card").each((i, element) => {
				//Headline - Title
				results.title = $(element).find($("h3.headline")).text();
				//Article Link
				results.link = $(element).attr("href");
				//Article Summary
				results.summary = $(element).find($("div.description")).text();
				//Article Image
				results.image = $(element).find($("img")).attr("src");
				// //Article Section
				//TODO readd later once working
				// let articleDept = $(element)
				// 	.find($("span.departmentItem"))
				// 	.text();
				console.log(results)

				db.Article.create(results)
					.then((dbArticle) => {
						console.log(dbArticle)
					})
					.catch((err) => {
						console.log("There is a scrape error: " + err)
						return res.json(err)
					})
			})
			res.send("Scrape Successful")
			//Scraped articles to show on page load
			res.redirect("/")
		})
	})
}
