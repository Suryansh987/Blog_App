import { Router } from "express";
import uploadFiles from "../middlewares/files.js";
import hashPass from "../middlewares/hashPass.js";
import { user } from "../db/models/userSchema.js";
import {deleteImage, uploadAvatarImage, uploadCoverImage} from "../cloudStore/cloudUpload.js";
import createJWT from "../controller/jwt.controller.js";
import verifyPass from "../controller/pass.controller.js";
import {validateRegisterData, validateLoginData} from "../middlewares/validate.js";
import fetchUser from "../middlewares/fetchUser.js";
import { header } from "express-validator";

const router = Router()
const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

/**
 * @swagger
 * /api/v1/user/signin:
 *   post:
 *     summary: User signup
 *     description: Sign up a new user with name, email, password, and optional avatar and cover image.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully signed up
 *       400:
 *         description: User already exists
 *       409:
 *         description: Conflict error
 */


//ROUTE : FOR USER SIGNUP with NAME, EMAIL, PASS, AVATAR,COVERIMAGE(POST)
router.post('/signin', validateRegisterData, hashPass, async (req, res) => {

    if (res.headersSent) return

    const { email, name, password } = req.body 
    const isUser = await user.findOne({email:email})
    if(isUser){
        return res.status(400).json({"error":"User already exixts"})
    }
    
    try {
        const newUser = await user.create({ name, email, password })
        const token = createJWT(newUser)
        res
    .status(200)
    .cookie('token', `Bearer ${token}` ,  { expires })
    .json({user:{
        name: newUser.name,
        email: newUser.email,
        avatar_url: newUser?.avatar_url,
        cover_url: newUser?.cover_url
    }
    })  
    } catch (err) {
        return res.status(409).json({"error":err.message})
    }
})


/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     description: Login a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid user
 *       401:
 *         description: Invalid credentials
 */


//ROUTE : FOR USER LOGIN WITH EMAIL AND PASS(POST)
router.post('/login', validateLoginData, async(req,res)=>{

    const {email,password} = req.body

    const userData = await user.findOne({email})

    if(!userData){ return res.status(400).json({"error":"Invalid User"}) }

    const result = await verifyPass(password, userData.password)

    if(!result){
        return res.status(401).json({"error":"Invalid Credentials"})
    }

    const token = createJWT(userData)

    res
    .status(200)
    .cookie('token', `Bearer ${token}`,  { expires })
    .json({user:{
        name: userData.name,
        email: userData.email,
        avatar_url: userData?.avatar_url,
        cover_url: userData?.cover_url
    }
    })
})

/**
 * @swagger
 * /api/v1/user/updateUser:
 *   put:
 *     summary: Update user data
 *     description: Update user data such as name, avatar, and cover image.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully updated user data
 *       409:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */



//ROUTE: UPDATE USER DATA
router.put('/updateUser', fetchUser, uploadFiles, async(req,res)=>{
   try {
     if(res.headersSent) return 
 
     const id = req.user._id
     const user_data = await user.findById(id)
     if(!user_data) return res.status(409).json({error:"User not Found"})
 
     const { name } = req.body
 
     if( user_data.name!==name && name ){
         user_data.name = name
     }
 
     const avatar = req?.files?.avatar
     const cover = req?.files?.cover
     
     let avatar_path,cover_path
     if(avatar){
         avatar_path = avatar[0].path
     }
     if(cover){
         cover_path = cover[0].path
     }
 
     const [ avatarPromise, coverPromise, avatarDelete, coverDelete] = [
         avatar_path?uploadAvatarImage(avatar_path):Promise.resolve(null),
         cover_path?uploadCoverImage(cover_path):Promise.resolve(null),
         avatar_path?user_data.avatar_id ? deleteImage(user_data.avatar_id):Promise.resolve(null):Promise.resolve(null),
         cover_path?user_data.cover_id ? deleteImage(user_data.cover_id):Promise.resolve(null):Promise.resolve(null)
     ]
 
     const [ avatar_data, cover_data, avatar_del_status, cover_del_status ] = await Promise.all([ avatarPromise, coverPromise, avatarDelete, coverDelete ])
     if(avatar_data){
             const { avatar_url,avatar_id } = avatar_data
             user_data.avatar_url = avatar_url
             user_data.avatar_id = avatar_id
     }
     if(cover_data){
         const { cover_url,cover_id } = cover_data
         user_data.cover_url = cover_url
         user_data.cover_id = cover_id
     }
     user_data.save({validateBeforeSave:false})
     res.status(200).json(user_data)
   } catch (error) {
        res.status(500).json({error:error.message})
   }

})


/**
 * @swagger
 * /api/v1/user/loguser:
 *   post:
 *     summary: Log user
 *     description: Get logged-in user's data from Cookies.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


router.post('/loguser',fetchUser, async(req,res)=>{
    if(res.headersSent) return

    try {
        const userId = req.user._id
        const userData = await user.findById(userId).select('_id name email avatar_url cover_url')
        if(userData){
            res.status(200).json({
                user: userData
            })
        }
        else{
            res.status(400).json({"error":"User not found"})
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

export default router
