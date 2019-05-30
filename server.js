//**************************************************
//                      SERVER
//**************************************************
//Require
//=================================================
//Require node modules
//Express
let express = require("express");
//Express-handlebars
let exphbs = require("express-handlebars");
//Body-Parser
let bodyParser = require("body-parser");
//Morgan
let logger = require("morgan");
//Mongoose
let mongoose = require("mongoose")

//Require Files
let db = require("./models");

//Set Variables
//=================================================
//Set Port
let PORT = process.env.PORT || 8080;

//Set up App Express
let app = express();

//Connection
//=================================================
//FIXME - connect to other file than import?
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cbcScraper";
mongoose.connect(MONGODB_URI);

//Configure Middleware
//=================================================
//Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Configure Morgan
app.use(logger("dev")); // Use morgan logger for logging requests

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Server Static Content
app.use(express.static(process.cwd() + "/public/"));

//Configure Routes
//=================================================
//Scrapping articles
// require("./controller/scrapper")(app)
// require("./controller/article")(app)
// require("./controller/comment")(app)
require("./controller/routes")(app)

// Execution
//=================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
