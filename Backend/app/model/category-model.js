const mongoose = require('mongoose')
const {Schema,model} = mongoose

const categorySchema = new Schema({
    name:String,
    // description:String,
    posts:[{
            type:Schema.Types.ObjectId, 
            ref:"Post"
        }]
},{timestamps:true})

const Category = model("Category",categorySchema) 

module.exports = Category