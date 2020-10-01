const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const products = new Schema({
    Title: String,
    Description: String,
    Price: Number,
    Thumb: String,
    Quantity: Number,
    Category:Array
});

module.exports = mongoose.model("products", products);