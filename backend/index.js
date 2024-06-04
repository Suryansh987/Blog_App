import express from 'express'
import userRoute from "./Routes/userRoutes.js"
import connectToDb from './db/db.js'
import blogRoute from './Routes/blogRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express()
const port = 3000

app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  },
  credentials: true,
}));
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for the Blog app',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./Routes/*.js'], // Path to the API docs
};

const specs = swaggerJSDoc(swaggerOptions);

connectToDb()
.then((status) => {
  if(status){
    app.listen(port, () => {
      console.log(`Blog app listening on port ${port}`)
    })
  }
  else{
    console.log('error:: While Connected to Database');
  }  
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.get('/',(req,res) => {
  res.send("Helllo")
})
app.use('/api/v1/user', userRoute)
app.use('/api/v1/blog', blogRoute)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))

