const Comments = require('../model/commnetsModel')
const Post = require('../model/postsModel')
const {validationResult} = require('express-validator')
const _= require('lodash')

const commentCltr={}

commentCltr.comment= async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const body = _.pick(req.body, ["comment","author","post"]); 
      const postId = req.params.postId
      
      try {
        let createComment = new Comments(body);
        createComment.author = req.user.id;
        createComment.post = postId
        
        await createComment.save();
        await Post.findByIdAndUpdate( postId , { $push: { comments: { commentId: createComment._id} }});
  
        createComment =await createComment.populate('author')
        res.status(201).json(createComment);
        


  
      } catch (e) {
        console.log(e)
        res.status(500).json(e)
      }
    }
  };
  

commentCltr.postAllCommnents = async(req,res)=>{
    try{
        const postAndComments =await Comments.find({postId:req.params.postId}).populate("author")
        res.status(200).json(postAndComments)
    }catch(e){
        res.status(400).json(e)
    }
}


commentCltr.listComments = async(req,res)=>{
    // const errors = validationResult
    // if(!errors.isEmpty()){
    //     res.status(400).json({errors:errors.array})
    // }
    try{
        const {postId} = req.params
        
        const comments = await Comments.find({post:postId}).populate("author")
        res.status(200).json(comments)
    }catch(err){
        res.status(201).json(err)
    }
}


commentCltr.update=async(req,res)=>{
    const errors= validationResult(req) 
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
    }else{
        const commentId = req.params.commentId
        const postId = req.params.postId
        const body = _.pick(req.body,["comment"])
        try{
            
            const comment = await Comments.findOneAndUpdate({_id:commentId,author:req.user.id,post:postId},body,{new:true})
            res.status(200).json(comment)
        }catch(e){
            console.log(e)
            res.status(500).json(e)
        }

    }
}


commentCltr.delete=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
    }else{
        const postId = req.params.postId
        const commentId = req.params.commentId
        console.log(postId,commentId)
        try{
            const Commnetdelete = await Comments.findOneAndDelete({post:postId,author:req.user.id,_id:commentId})
            await Post.findByIdAndUpdate(postId,{$pull:{comments:commentId}})
            res.status(200).json(Commnetdelete)
        }catch(e){
            res.status(500).json(e)
        }
    }

}
module.exports = commentCltr