const mongoose = require('mongoose')
const {Schema,model} = mongoose

const postSchema = new Schema({
    title:String,
    content:String,
    image:{
        type:String
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[{
        commentId:{
            type:Schema.Types.ObjectId, 
            ref:"Comments"
        },
        comment:String
        
    }],
    categories:[{
        categoryId:{
            type:Schema.Types.ObjectId,
            ref:"Category"
        }
        
    }]
   
    // featureImage:String && Image

},{timestamps:true})
const Post = model("Post",postSchema)
module.exports = Post