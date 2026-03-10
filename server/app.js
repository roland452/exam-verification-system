import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()
const MONGO_URI = process.env.MONGO_URI
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


mongoose.connect(MONGO_URI).then(() => {
    console.log('mongodb connection successful');
}).catch((err) => {
    console.log('mongodb connection failed');
})


app.use(cors({
    origin:`${process.env.CLIENT_URL}`,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb'}))
app.use(express.urlencoded({ limit: '10mb', extended: true}))
app.use('/uploads',express.static(path.join(__dirname,'uploads'),{
    setHeaders: (res, path) => {
        res.setHeader('Content-Disposition','attachment')
    }
}))





// admin route import
import adminRoute from './routes/admin/admin.js'
import courseRoute from './routes/admin/course.js'
import noticeRoute from './routes/admin/notice.js'



// admin usage
app.use('/',adminRoute)
app.use('/',courseRoute)
app.use('/',noticeRoute)




// _____________________ Student Route _________________


//student route imports
import studentSignup from './routes/students/signup.js'
import studentLogin from './routes/students/login.js'
import studentCourseRoute from './routes/students/course.js'



// route usage
app.use('/',studentSignup)
app.use('/',studentLogin)
app.use('/',studentCourseRoute)



export default app;