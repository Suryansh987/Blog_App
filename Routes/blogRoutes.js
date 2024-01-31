import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import { uploadThumbnailImage } from '../cloudStore/cloudUpload.js'

const router = Router()

router.get('/addblog', fetchUser , uploadFiles , (req,res)=>{
    if(!req.user){ return res.status(409).json({"error":"Please Login First"})}
    const user = req.user._id
    const { title, description, tag } = req.body
    if([title,description].some((value)=>{
        return (value?.trim()==="" || value?.trim()===undefined)
    })){
        return res.status(400).json({"error":"All required fields are not present"})
    }
    const thumbnail = req.files?.thumbnail
    if(!thumbnail){ return res.status(400).json({"error":"Thumbnail is required"}) }
    const thumbnail_path = thumbnail[0].path
    const thumbnail_url = uploadThumbnailImage(thumbnail_path)
    const newblog = blog.create({title , description , tag , "thumbnail": thumbnail_url , user})
    res.send(newblog)
})

export default router