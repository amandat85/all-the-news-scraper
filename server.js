//**************************************************
//SERVER
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
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cbcPopulater";
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
app.use(express.static("public"));

//Configure Routes
//=================================================
//Scrapping articles
require("./controller/webScrapper")(app);
//Save articles
//Comments

// Execution
//=================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
