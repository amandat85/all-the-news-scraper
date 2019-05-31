//**************************************************
//             SCRAPPER AND SCRAPPER ROUTE
//**************************************************/
//Require
//=================================================
//Require node modules
const cheerio = require("cheerio")
//set max content length 50mbs
const axios = require("axios")

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
		axios.get("https://www.cbc.ca/news",
		{ maxContentLength: 50 * 1000 * 1000 }
	  )
		.then(function (response) {
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
			// res.send("Scrape Successful")
			//Scraped articles to show on page load
			res.redirect("/articles")
		})
	})
	//GET - get articles from db
	app.get("/articles", function (req, res) {
			//allows newer articles to be on top
			db.Article.find().sort({_id: -1}).limit(9)
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
	app.get("/saved", function (req, res) {
		//Query: in our database, go to the articles collection, 
		//then "find" every article that is saved (has a saved value of true);
		db.Article.find({ saved: true }, function (error, result) {
		  //Log any errors if the server encounters one.
		  console.log(result)
		  if (error) {
			console.log("Error in getting saved articles: " + error);
		  }
		  //Otherwise, send the result of this query to the browser.
		  else {
			//res.json(result);
			res.render("saved", {
			  article: result,
			});
		  }
		});
	  });
	//POST - insert new note 
	//PUT - change articles status to save
	app.put("/savedarticles/:id", function (req, res) {
    
		db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
		.then(function (result) {
		  console.log("this savedarticle is working");
		  res.json(result);
		  
		})
		.catch(function (err) {
		  res.json(err);
		  console.log("Error in finding saved articles: " + err);
		});
	  });
	//PUT - delete an article from saved by changing its status to saved: false

	//Can add delete note??
}
