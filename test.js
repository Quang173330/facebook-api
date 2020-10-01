const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/facebook", {useNewUrlParser: true});
const Products = require("./server/models/products.js");
const Users = require("./server/models/users.js")
mongoose.set('useFindAndModify', false);
let array = [{
    "id":"125"
},{
    "id":"456"
}]
async function get(){
   try {
    let c= await Products.findOne({Thumb:"123"})
    let d = c.Category;
    console.log(d.length)
   } catch (error) {
       console.log(error)
   }
    
} 
async function ge(){
    let c= await Users.findOne({Phonenumber:"0343530535"})
    console.log(c.Password)
}
ge();
get();