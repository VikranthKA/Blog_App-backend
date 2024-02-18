const mongoose = require('mongoose')
const {Schema,model} = mongoose

const commnetsSchema = new Schema({ 
    comment:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    post:{
        type:Schema.Types.ObjectId, 
        ref:'Post'
    }
},{timestamps:true})

const Comments = model("Comments",commnetsSchema)
module.exports = Comments
