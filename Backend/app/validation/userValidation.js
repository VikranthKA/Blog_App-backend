const User = require('../model/userModel')

const userValidationRegistration ={

    username:{
        notEmpty:{
            errorMessage:"User name connot be empty"
        },
        isLength:{
            options:{min:3,max:64},
            errorMessgae:"User name btw 3 to 64 "
        },
        custom:{
            options:async(value)=>{
                const user =await User.findOne({username:value})
                if(user){
                    throw new Error('Username is already taken')
                }else{
                    return true
                }

            }
        }
    },
    email:{
        notEmpty:{
            errorMessage:"Email should not be empty"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        custom:{
            options:async(value)=>{
                const user = await User.findOne({email:value})
                if(user){
                    throw new Error("Email is already Taken")
                }
                else{
                    return true
                }
            }
        }
    },
    password:{
        notEmpty:{
            errorMessage:"Password cannot be empty"
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:"Password length btw 8 to 128"
        }
    },
    bio:{
        //optional
        
    },
    profilePic:{
        //optional
    }



}
const loginValidationSchema={
    email:{
        notEmpty:{
            errorMessage:"Email cannot be empty"
        },
        isEmail:{
            errorMessage:"Invalid email format"
        }
    },
password:{
        notEmpty:{
            errorMessage:'password cannot be empty' 
        },
        isLength:{ 
            options:{min:8,max:128},
            errorMessage:'password btw 8 to 128' 
        }
    }
}

module.exports ={
                RegisterSchema:userValidationRegistration,
                LoginSchema:loginValidationSchema
                }

