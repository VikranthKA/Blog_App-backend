const commentValidationSchema={
    comment:{
        notEmpty:{
            errorMessge:"Comment Cannot be empty"
        },
        isLength:{
            options:{min:1,max:100000},//how to trim
            erroMessage:"Comment btw 1 to 100000"
        }
    }
    
}

module.exports = {CommentSchema:commentValidationSchema}