//**************************************************
//                      SERVER
//**************************************************
//Require
//=================================================
//Require node modules
//Express
const express = require("express");
//Express-handlebars
const exphbs = require("express-handlebars");
//Body-Parser
const bodyParser = require("body-parser");
//Morgan
const logger = require("morgan");
//Mongoose
const mongoose = require("mongoose")

//Set Variables
//=================================================
//Set Port
const PORT = process.env.PORT || 8080;

//Set up App Express
const app = express();

//Connection
//=================================================
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cbcScraper";
mongoose.connect(MONGODB_URI);

//Configure Middleware
//=================================================
//Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Configure Morgan
app.use(logger("dev"));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Server Static Content
app.use(express.static(process.cwd() + "/public/"));

//Configure Routes
//=================================================
require("./controller/routes")(app)

// Execution
//=================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
