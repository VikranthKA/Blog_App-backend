const mongoose = require('mongoose')


const configureDB=async()=>{
    try{
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/july23-Blog-website')
        console.log('connected to the db')
    }catch(error){
        console.log(error)
    }
}
module.exports = configureDB