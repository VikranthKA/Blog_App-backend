const express  = require('express')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')
const helmet = require('helmet')
const compression = require('compression');

//const bodyParser = require('bodyParser') 
const {checkSchema} = require('express-validator')
const configureDB = require('./config/db')
const multer = require('multer')

const app = express()
const port = process.env.PORT 

const userCltr = require('./app/controllers/userCltr')
const postCltr = require('./app/controllers/postCltr')
const commentCltr = require('./app/controllers/commnetCltr')
const categoryCtrl = require('./app/controllers/categoryCltr')

const authenticateUser = require('./app/middleware/auth')

const {LoginSchema,RegisterSchema} = require('./app/validation/userValidation')
const {PostSchema} = require('./app/validation/postsValidation')
const {CommentSchema} = require('./app/validation/commentValidation')
const {categorySchema} = require('./app/validation/categoryValidation')



//middleware
const cors = require('cors')
// app.use(morgan('combined'))
// The combined format in morgan includes more information in the log, such as the remote IP address, request method, HTTP version, status code, response size, and referer.

// app.use(helmet())
// Purpose: helmet is a middleware that sets various HTTP headers to improve security by mitigating common web vulnerabilities.
// Key Features:
// Adds various HTTP headers like Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, etc., to protect against common security vulnerabilities.
// Helps prevent information disclosure.

// app.use(compression())
// Purpose: compression is a middleware that compresses HTTP responses to reduce response times and bandwidth usage.
// Key Features:
// Compresses response bodies before sending them to the client.
// Reduces the size of data transmitted over the network.
// Improves performance by reducing the time it takes to load web pages.
//app.use(bodyParser.json())

app.use(express.json()) 
// Purpose: body-parser is a middleware that parses incoming request bodies, allowing you to access form data and JSON payloads in your routes.
// Key Features:

// Parses JSON-formatted request bodies.
// Parses URL-encoded form data.
// Makes request data available in req.body for easy access in route handlers.
// The extended: true option allows parsing of rich objects and arrays.
app.use(cors())

app.use(express.static("public")) 

configureDB()

const staticpath = path.join(__dirname,"/Uploads")


app.use("/Uploads",express.static(staticpath))

const storage = multer.diskStorage({ 
    destination:(req,file,cb)=>{
        cb(null,'Uploads/images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.fieldname+"__"+Date.now()+path.extname(file.originalname))
    }
})


const upload = multer({storage:storage})

//APIs for User
app.post('/api/users/register',upload.single('file'), checkSchema(RegisterSchema), userCltr.register)
app.post('/api/users/login', checkSchema(LoginSchema), userCltr.login)
app.get('/api/users/profile', authenticateUser, userCltr.profile)
app.put('/api/users/profile',upload.single('file'),authenticateUser,userCltr.updateProfile)

//APIs for posts 
app.post('/api/posts',authenticateUser,upload.single('file'),checkSchema(PostSchema),postCltr.create)
app.get('/api/posts',postCltr.getAll)
app.get('/api/posts/:id',postCltr.getById)
app.put('/api/posts/:id',upload.single('file'),authenticateUser,postCltr.update)
app.delete('/api/posts/:id',authenticateUser,postCltr.remove)
app.get('/api/posts/myposts',authenticateUser,postCltr.myposts)

//APIs for comments
app.post('/api/posts/:postId/comments',authenticateUser,checkSchema(CommentSchema),commentCltr.comment)
app.put('/api/posts/:postId/comments',authenticateUser,commentCltr.postAllCommnents)
app.get('/api/posts/:postId/comments',commentCltr.listComments)
app.put('/api/posts/:postId/comments/:commentId',authenticateUser,commentCltr.update)
app.delete('/api/posts/:postId/comments/:commentId',authenticateUser,commentCltr.delete)

//APIs for category 
app.post("/api/category",checkSchema(categorySchema),categoryCtrl.createCategory)
app.get("/api/category",categoryCtrl.getAll)


app.listen(port,()=>{
    console.log('App running on the port number',port) 
})