const postsValidation = {
    title:{
        isLength:{
            options:{min:1,max:1000},
            errorMessage:"Should be btw 1 to 1000"
        },
        notEmpty:{
            errorMessage:"Post cannot be empty"
        }

    },
    content:{
        isLength:{
            options:{min:1,max:1000000},
            errorMessage:"Should be btw 1 to 1000"
        },
        notEmpty:{
            errorMessage:"Post cannot be empty"
        }

    },
    image:{

    },

    comments:{
        //Optionls
    },
    tags:{

    }
    


    
}

module.exports = {PostSchema:postsValidation} 