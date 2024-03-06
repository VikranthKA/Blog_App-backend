const User = require('../model/userModel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const _ = require('lodash')

const { validationResult } = require('express-validator')

const userCltr={}

userCltr.register=async(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()})
        }else{
            const body = _.pick(req.body,['username','email','password','image','bio'])
            if(req.file){
                body.image = req.file.filename
                console.log(body.image)
                // http://localhost:3333/Uploads/images/1704262552994file__1704262552994.webp
            }
            try{
                const user = new User(body)
                const salt =await bcryptjs.genSalt()
                const encryptedPwd = await bcryptjs.hash(user.password,salt)
                user.password = encryptedPwd
                await user.save()
                res.status(201).json(user)

            }catch(e){
                res.status(500).json(e)
                console.log(e)
            }
        }
}
userCltr.login=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }else{
        const body = _.pick(req.body, ["email","password"])
      
        try{
           
            const user =await User.findOne({email: body.email})
            
            if(!user){
                return res.status(404).json({error: "invalid email/password"})
            }
            
            
            const result = await bcryptjs.compare(body.password, user.password)

            if(!result){
                return res.status(404).json({error: "invalid email/password"})
            }
         
            const tokenData = {id: user._id}
            const secretKey = process.env.JWT_WORD
            const token = jwt.sign(tokenData, secretKey, {expiresIn:"14d"})
            res.status(201).json({token:token})
        }catch(e){
            console.log(e)
            res.status(500).json({errors:errors.array()})
        }

    }
}
userCltr.profile = async(req,res)=>{
    
    
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }catch(e){
        res.status(500).json(e)
    }
}


userCltr.updateProfile = async(req,res)=>{//not defined the validation
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({error:"Validation Error"})
    }else{
        const body = _.pick(req.body,["bio","image"])
        if(req.file){
            body.image = req.file.filename
        }
        try{
            
            // console.log(body)
            const user = await User.findOneAndUpdate({_id:req.user.id},{new:true})
            user.bio=body.bio
            user.profilePic=body.image

            await user.save()
            res.status(201).json(user)
        }catch(e){
            console.log(e)
            res.status(500).json(e)
        }



    }
}

userCltr.changePassword = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    } else {
        
        const body = _.pick(req.body, ['newpassword', 'changePassword'])
        try { 
            const user = await User.findById(req.user.id)
            if(!user){
                return res.status(404).json({errors:'invalid email/password in backend'})
            }
            const PasswordValid = await bcryptjs.compare(body.newpassword,user.password)
            if(!PasswordValid){
                return res.status(404).json({errors:'invalid email/password in backend'})
            }
            
            const salt = await bcryptjs.genSalt()
            const encryptedPwd = await bcryptjs.hash(body.password, salt)
            user.password = encryptedPwd
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            res.status(500).json(e) 
        }
    }
}
//Update Password

module.exports = userCltr