import express from 'express'
import userRoute from "../Routes/userRoutes.js"
import connectToDb from '../db/db.js'
import blogRoute from '../Routes/blogRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const port = 3000

connectToDb()
.then((status) => {
  if(status){
    app.listen(port, () => {
      console.log(`Blog app listening on port ${port}`)
    })
  }
  else{
    console.log('Error:: While Connected to Database');
  }  
})

app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/api/v1/user', userRoute)
app.use('/api/v1/blog', blogRoute)

