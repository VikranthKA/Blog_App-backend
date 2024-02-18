const Category=require('../model/category-model')
const _=require('lodash')
const {validationResult} = require('express-validator')


const categoryCtrl = {}


categoryCtrl.createCategory = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const body = _.pick(req.body,["label","description"]) 
    try{
        const category =  new Category(body)
        await category.save()
        res.json(category)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
}
}

categoryCtrl.getAll=async(req,res)=>{
    try{
        const data = await Category.find().populate("posts")
        res.status(200).json(data)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}


module.exports=categoryCtrl