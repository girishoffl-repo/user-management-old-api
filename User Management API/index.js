require('dotenv').config()
require('express-async-errors')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

const userRouter = require('./route/userRoute')
// db connect 
const connect = require('./config/db/connect')


//middleware
const notFoundMiddleware = require('./middleware/routeNotFoundError')
const errorHandlerMiddleware = require('./middleware/errorHandler')

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/api/v1/users',userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//port 
const PORT = process.env.PORT || 5001

//server with db 
const start = async(url)=>{
  try {
    await connect(url)
    app.listen(PORT,console.log(` Server is on Live ${PORT} connected to DB`))

  } catch (error) {
    console.log(error);
  }
}

// start(`mongodb://mon_user:mondbgo123@10.2.3.198:27017/trainee_project_db?authSource=admin`)
start(process.env.MONGODB)