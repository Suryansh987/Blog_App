import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import {  deleteImage, uploadThumbnailImage } from '../cloudStore/cloudUpload.js'
import { validateBlogData } from '../middlewares/validate.js'

const router = Router()

router.post('/addblog', fetchUser , uploadFiles , validateBlogData , async(req,res)=>{
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

router.post('/updatethumbnail/:id', fetchUser, uploadFiles, async(req,res)=>{

    if(res.headersSent) return

    const thumbnail = req.files?.thumbnail
    if(!thumbnail){
        res.status(400).json({error:"thumbnail Image is mandatory"})
    }

    const id = req.params.id

    const thumbnail_path = thumbnail[0].path
    const blog_data = await blog.findById(id)

    if(!blog_data) return res.status(409).json({error:"Not a valid User"})

        // Start both operations concurrently
        const [uploadPromise, deletePromise] = [
            uploadThumbnailImage(thumbnail_path),
            blog_data.thumbnail_id ? deleteImage(blog_data.thumbnail_id) : Promise.resolve(null)
        ];
    
        try {
            // Wait for both promises to resolve
            const [upload_data, delete_status] = await Promise.all([uploadPromise, deletePromise]);
    
            // Update user data with new avatar information
            const { thumbnail_url, thumbnail_id } = upload_data;
            blog_data.thumbnail_url = thumbnail_url;
            blog_data.thumbnail_id = thumbnail_id;
            await blog_data.save({ validateBeforeSave: false });
    
            // Send response after both processes are completed
            res.json({upload_data,delete_status});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
})


export default router