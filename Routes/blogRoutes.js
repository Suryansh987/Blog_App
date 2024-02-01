import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import { uploadThumbnailImage } from '../cloudStore/cloudUpload.js'
import { validateBlogData } from '../middlewares/validate.js'

const router = Router()

router.get('/addblog', fetchUser , uploadFiles , validateBlogData, async(req,res)=>{
    const user = req.user._id
    const { title, description, tag } = req.body
    const thumbnail_path = req.files.thumbnail[0].path
    const thumbnail_url = await uploadThumbnailImage(thumbnail_path)
    const newblog = await blog.create({title , description , tag , "thumbnail": thumbnail_url , user})
    res.send(newblog)
})

export default router