import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import {  uploadThumbnailImage } from '../cloudStore/cloudUpload.js'
import { validateBlogData } from '../middlewares/validate.js'

const router = Router()

router.get('/addblog', fetchUser , uploadFiles , validateBlogData , async(req,res)=>{
    const user = req.user._id
    const { title, description, tag } = req.body
    const thumbnail_path = req.files.thumbnail[0].path
    const thumbnail_data = await uploadThumbnailImage(thumbnail_path)
    const { thumbnail_url, thumbnail_id } = thumbnail_data 
    const newblog = await blog.create({title , description , tag , thumbnail_url , thumbnail_id , user})
    res.send(newblog)
})

router.get('/fetch', fetchUser , async(req,res)=>{
    const user_id = req.user._id;
    try {
        const userBlogs = await blog.find({user:user_id});
        res.status(200).json(userBlogs);
    } catch (error) {
        return res.status(500).json({"error":error.message})
    }
})


export default router