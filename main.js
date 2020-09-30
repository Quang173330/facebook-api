const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const user = require("./server/api/user.js")
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/facebook", {useNewUrlParser: true});



app.use(bodyParser.json());
app.use('/user', user);


app.listen(8080, () => console.log("Server started in port 3800"));