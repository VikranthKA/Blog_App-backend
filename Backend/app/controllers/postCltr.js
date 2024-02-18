const _ = require('lodash')
const { validationResult } = require('express-validator');
const Comments = require("../model/commnetsModel")
const Post = require('../model/postsModel')
const Category = require('../model/category-model');
const User  = require("../model/userModel")
const { populate } = require('../model/userModel');


const postCltr={}

// postCltr.create=async(req,res)=>{
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         res.status(400).json({errors:errors.array()})
//     }else{
//         const body = _.pick(req.body,["title","content","categories","image"])
//             console.log(body.categories,"categories")
//             const tag = JSON.parse(body.categories)
//             body.categories = tag.map(ele=>({categoryId:ele}))
            
//         try{
            
//             const post = new Post(body)
             
//             if(post.image){

//                 post.image = req.file.filename
//             }
//             post.author = req.user.id
//             await post.save()
//             console.log(post.author,"i am author")
//             if(post.author && req.user.id){
//                 console.log("In the if lop")
//                 post.author._id = post.author
//                 const userDetails = await User.findById({_id:req.user.id})
//                 post.author.username =  userDetails.username
//                 post.author.email =  userDetails.email
//                 post.author.createdAt =  userDetails.createdAt
//                 post.author.updatedAt =  userDetails.updatedAt
                
//                 console.log(post,"End of if loop")
                
//             }



            
//             // // Loop through each category in the post and update the corresponding Category document in the database
//             post.categories.forEach(async(ele)=>{
//             // // Update the Category document by pushing the post ID into the 'posts' array
//                 await Category.findByIdAndUpdate(ele.categoryId,{$push:{posts:post._id}})
//             })
//             res.status(201).json(post)
//             // 
//         }catch(e){
//             console.log(e)
//             res.status(500).json(e)
//         }
//     }
// }
postCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const body = _.pick(req.body, ["title", "content", "categoryIds"]);
        body.image = req.file.filename
        console.log(body.image,"I am body image")
        if(body.categoryIds){
            const tag = JSON.parse(body.categories)

            body.categories = tag.map((ele) => ({ categoryId: ele }));
        }

        try {
            const post = new Post(body)

            if (post.image) {
                post.image = req.file.filename;
            }

            post.author = req.user.id;
            await post.save();

            // Check if req.user.id is valid before updating post.author fields
            // if (req.user.id) {
            //     const userDetails = await User.findById(req.user.id);

            //     if (userDetails) {
            //         post.author._id = userDetails._id;
            //         post.author.username = userDetails.username;
            //         post.author.email = userDetails.email;
            //         post.author.createdAt = userDetails.createdAt;
            //         post.author.updatedAt = userDetails.updatedAt;
            //     }
            // }

            // Loop through each category in the post and update the corresponding Category document in the database
            post.categories.forEach(async (ele) => {
                // Update the Category document by pushing the post ID into the 'posts' array
                await Category.findByIdAndUpdate(ele.categoryId, { $push: { posts: post._id } });
            });

            // Use populate to get the author details only if the author field exists
            const populatedPost = await Post.findById(post._id).populate({
                path: 'author',
                select: 'username email createdAt updatedAt',
            })

            res.status(201).json(populatedPost)
            
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
};

postCltr.getById=async(req,res)=>{//single post By Id
    try{
        
        const posts = await Post.findOne({_id:req.params.id}).populate('comments.commentId').populate("author").exec()//author:req.user.id
        
        res.status(200).json(posts)
    }catch(e){
        res.status(500).json(e)
    }
}
postCltr.getAll=async(req,res)=>{
    try{
        const post = await Post.find().populate("author").populate("categories.categoryId").populate('comments.commentId')
        res.json(post)
    }catch(e){
        console.log(e)
        res.status(500).json({e:"error in catch"}) 
    }
}
postCltr.update  =async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
    }else{
        const body = _.pick(req.body,["title","content","categories","image"])

        console.log(body)
        try{
            const post = await Post.findOneAndUpdate({_id:req.params.id,author:req.user.id}, body,{new:true}).populate("comments")

        
            if(body.categories){
                console.log("Inside the category")

                        // Loop through each category in the post and update the corresponding Category document in the database
            post.categories.forEach(async (ele) => {
                            // Update the Category document by pushing the post ID into the 'posts' array
                await Category.findByIdAndUpdate(ele.categoryId, { $push: { posts: post._id } });
            });
        }
                        // Use populate to get the author details only if the author field exists
            const populatedPost = await Post.findById(req.params.id).populate({
                path: 'author',
                select: 'username email createdAt updatedAt',
            });
            
            res.status(201).json(populatedPost)
        }catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    }
}
postCltr.remove=async(req,res)=>{
    try{
        const postDelete = await Post.findOneAndDelete({
            
            _id:req.params.id,
            author:req.user.id

        })
        res.status(200).json(postDelete)
    }catch(e){
        res.status(500).json(e)
    }
}

postCltr.myposts= async(req,res)=>{
    try{
        const getMyPosts = await Post.find({author:req.user.id})
        res.status(200).json(getMyPosts)
    }catch(e){
        res.status(500).json(e)
    }

}

module.exports = postCltr