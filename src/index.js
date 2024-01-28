import express from 'express'
import userRoute from "../Routes/userRoutes.js"
import connectToDb from '../db/db.js'

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

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/v1/user', userRoute)


