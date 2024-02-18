
const categoryValidationSchema={
    label:{
        notEmpty:{
            errorMessage:'name is requried'
        },
        isLength:{
            options:{min:1,max:64},
            errorMessage:"name is 5-64 charecters"
        }
        
    },
    // description:{
    //     notEmpty:{
    //         errorMessage:'discription is not empty'
    //     }
    // }
    
}

module.exports = {
    categorySchema:categoryValidationSchema
}