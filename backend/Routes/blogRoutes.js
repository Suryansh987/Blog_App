import { Router } from 'express'
import { blog } from '../db/models/blogSchema.js'
import fetchUser from '../middlewares/fetchUser.js'
import uploadFiles from '../middlewares/files.js'
import { deleteImage, uploadThumbnailImage } from '../cloudStore/cloudUpload.js'
import { validateBlogData } from '../middlewares/validate.js'
import { user } from '../db/models/userSchema.js'

const router = Router()


/**
 * @swagger
 * /api/v1/blog/addblog:
 *   post:
 *     summary: Add a new blog
 *     description: Add a new blog post with title, description, and thumbnail.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tag:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully added a blog
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

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


/**
 * @swagger
 * /api/v1/blog/fetchall:
 *   get:
 *     summary: Fetch all blogs
 *     description: Fetch all blogs for the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all blogs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/fetchall', fetchUser, async (req, res) => {
    try {
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


/**
 * @swagger
 * /api/v1/blog/userdetails/{email}:
 *   get:
 *     summary: Get user details
 *     description: Get details of the user along with their blogs by email.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Successfully fetched user details
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.get('/userdetails/:email', fetchUser, async (req, res) => {
    if(!req.user._id) return res.status(400).json({error:"Please Login First"})
    const email = req.params.email
    try {
        const data = await user.aggregate(
            [
                {
                  $match: {
                    email: email,
                  },
                },
                {
                  $lookup: {
                    from: "UserBlogs",
                    localField: "_id",
                    foreignField: "user",
                    as: "blogs",
                  },
                },
                {
                  $project: {
                    _id: 0,
                    user_data: {
                      _id: "$_id",
                      name: "$name",
                      email: "$email",
                      avatar_url: "$avatar_url",
                      cover_url: "$cover_url",
                    },
                    Blogs_data: {
                      $map: {
                        input: "$blogs",
                        as: "blog",
                        in: {
                          _id: "$$blog._id",
                          title: "$$blog.title",
                          thumbnail_url: "$$blog.thumbnail_url",
                          description: "$$blog.description",
                        },
                      },
                    },
                  },
                },
              ]    
        );
        
        const { user_data, Blogs_data } = data[0]

        res.status(200).json({
            user_data:user_data,
            user_Blogs:Blogs_data
        });
    } catch (error) {
        return res.status(500).json({ "error": error.message })
    }
})

/**
 * @swagger
 * /api/v1/blog/updateblog/{id}:
 *   put:
 *     summary: Update a blog
 *     description: Update a blog post by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the blog to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated the blog
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

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

        // Update user data with new data information
        if (upload_data) {
            const { thumbnail_url, thumbnail_id } = upload_data;
            blog_data.thumbnail_url = thumbnail_url;
            blog_data.thumbnail_id = thumbnail_id;
        }
        await blog_data.save({ validateBeforeSave: false });

        // Send response after both processes are completed
        res.status(200).json({Blog:blog_data})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


/**
 * @swagger
 * /api/v1/blog/deleteblog/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Delete a blog post by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the blog to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted the blog
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.delete('/deleteblog/:id', fetchUser, async(req,res) => {
    try {
        const id = req.params.id
        const data = await blog.findByIdAndDelete(id)
        res.status(200).json(data)
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }

})


export default router