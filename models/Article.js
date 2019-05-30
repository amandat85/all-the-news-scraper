//**************************************************
//                  ARTICLE SCHEMA
//**************************************************/}

//Require Mongoose
const mongoose = require("mongoose")

//Set up Schema constructor in variable
const Schema = mongoose.Schema

//Article Schema
//=================================================
let ArticleSchema = new Schema ({
    //Title
    title: {
        type: String,
        required: true
    },
    //Link
    link: {
        type: String,
        required: true
    },
    //Summary
    summary: {
        type: String,
        required: true 
    },
    //Image
    image: {
        type: String,
        required: true
    },
    //TODO readd
    // //Dept
    // dept: {
    //     type: String
    // },
     //save is required as a boolean, default false
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    //Comment - join
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
})

//Create Model
//=================================================
let Article = mongoose.model("Article", ArticleSchema)

//Exports
//=================================================
module.exports = Article