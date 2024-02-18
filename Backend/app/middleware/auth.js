const jwt = require('jsonwebtoken')


const authenticateUser =(req,res,next)=> {
    const token = req.headers['authorization']
    if(!token){
        return res.status(400).json({err:"token is missing"})
    }
    try{
        const tokenData = jwt.verify(token,process.env.JWT_WORD)
        req.user= {id:tokenData.id}
        next()
    }catch(e){
        res.status(401).json()
    }
    
}

module.exports = authenticateUser
