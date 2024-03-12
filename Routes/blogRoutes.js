import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import { deleteImage, uploadThumbnailImage } from '../cloudStore/cloudUpload.js'
import { validateBlogData } from '../middlewares/validate.js'
import { user } from '../db/models/userSchema.js'
import mongoose from 'mongoose'

const router = Router()

router.post('/addblog', fetchUser, uploadFiles, validateBlogData, async (req, res) => {
    const user = req.user._id
    const { title, description,tag } = req.body
    const thumbnail_path = req.files.thumbnail[0].path
    const thumbnail_data = await uploadThumbnailImage(thumbnail_path)
    const { thumbnail_url, thumbnail_id } = thumbnail_data
    const newblog = await blog.create({ title, description, tag:tag?tag:"General" , thumbnail_url, thumbnail_id, user })
    res.status(200).json({
        _id:newblog._id,
        title:newblog.title,
        tag:newblog.tag,
        description:newblog.description,
        thumbnail_url:newblog.thumbnail_url,
        user:req.user._email
    })
})

router.get('/fetchall', fetchUser, async (req, res) => {
    try {
        // const userBlogs = await blog.find({ user: user_id }).select('title description thumbnail_url user');
        const userBlogs = await blog.aggregate(
            [
                {
                    $lookup: {
                        from: "Users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        thumbnail_url: 1,
                        user: "$user.email"
                    }
                }
            ]
        );

        res.status(200).json({ blogs: userBlogs });
    } catch (error) {
        return res.status(500).json({ "error": error.message })
    }
})

router.get('/userblogs', fetchUser, async (req, res) => {
    const user_id = req.user._id;
    try {
        // const userBlogs = await blog.find({ user: user_id }).select('title description thumbnail_url user');
        const userBlogs = await blog.aggregate(
            [
                {
                    $match: {
                        user:
                            new mongoose.Types.ObjectId(user_id)
                    },
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        thumbnail_url: 1,
                        user: "$user.email",
                    },
                },
            ]
        );

        res.status(200).json({ blogs: userBlogs });
    } catch (error) {
        return res.status(500).json({ "error": error.message })
    }
})

router.put('/updateblog/:id', fetchUser, uploadFiles, async (req, res) => {

    if (res.headersSent) return

    const id = req.params.id
    const blog_data = await blog.findById(id)
    if (!blog_data) return res.status(409).json({ error: "Not a valid User" })

    const { title, description } = req.body
    if (title && title !== blog_data.title) {
        blog_data.title = title
    }
    if (description && description !== blog_data.description) {
        blog_data.description = description
    }

    const thumbnail = req.files?.thumbnail
    let thumbnail_path
    if (thumbnail) {
        thumbnail_path = thumbnail[0].path
    }




    // Start both operations concurrently
    const [uploadPromise, deletePromise] = [
        thumbnail_path ? uploadThumbnailImage(thumbnail_path) : Promise.resolve(null),
        thumbnail_path ? blog_data.thumbnail_id ? deleteImage(blog_data.thumbnail_id) : Promise.resolve(null) : Promise.resolve(null)
    ];

    try {
        // Wait for both promises to resolve
        const [upload_data, delete_status] = await Promise.all([uploadPromise, deletePromise]);

        // Update user data with new avatar information
        if (upload_data) {
            const { thumbnail_url, thumbnail_id } = upload_data;
            blog_data.thumbnail_url = thumbnail_url;
            blog_data.thumbnail_id = thumbnail_id;
        }
        await blog_data.save({ validateBeforeSave: false });

        // Send response after both processes are completed
        res.send(blog_data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


export default router