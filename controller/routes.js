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
	app.get("/", function(req, res) {
		res.redirect("/articles");
	});
	//GET Route for scraped articles
	app.get("/scrape", (req, res) => {
		axios.get("https://www.cbc.ca/news").then(function (response) {
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
	//GET - get articles from db
	app.get("/articles", function (req, res) {
			//allows newer articles to be on top
			db.Article.find().sort({_id: -1}).limit(8)
				//send to handlebars
				.exec(function(err, doc) {
					if(err){
						console.log(err);
					} else{
						var article = {article: doc};
						res.render('index', article);
					}
			});
		});
	//GET  - articles by id to populate comment
	// db.Article.findById({ _id: req.params.id }).populate("comments").then(function (dbArticle) {
	// 	res.json(dbArticle);
	// })
	// 	.catch(function (err) {
	// 		res.json(err);
	// 	});
	//GET - get saved articles
	//POST - insert new note 
	//PUT - change articles status to save
	//PUT - delete an article from saved by changing its status to saved: false

	//Can add delete note??
}
