import { Router } from "express";
import uploadFiles from "../middlewares/files.js";
import hashPass from "../middlewares/hashPass.js";
import { user } from "../db/models/userSchema.js";
import {deleteImage, uploadAvatarImage, uploadCoverImage} from "../cloudStore/cloudUpload.js";
import createJWT from "../controller/jwt.controller.js";
import verifyPass from "../controller/pass.controller.js";
import {validateRegisterData, validateLoginData} from "../middlewares/validate.js";
import fetchUser from "../middlewares/fetchUser.js";

const router = Router()

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
    .cookie('token', `Bearer ${token}`)
    .json({user:{
        name: userData.name,
        email: userData.email,
        avatar_url: userData?.avatar_url,
        cover_url: userData?.cover_url
    }
    })  
    } catch (err) {
        return res.status(409).json({"error":err.message})
    }
})

//ROUTE : FOR USER LOGIN WITH EMAIL AND PASS(POST)
router.post('/login', validateLoginData, async(req,res)=>{

    const {email,password} = req.body

    const userData = await user.findOne({email})

    if(!userData){ return res.status(400).json({"error":"Invalid User"}) }

    const result = await verifyPass(password, userData.password)

    if(!result){
        res.status(401).json({"error":"Invalid Credentials"})
    }

    const token = createJWT(userData)

    res
    .status(200)
    .cookie('token', `Bearer ${token}`)
    .json({user:{
        name: userData.name,
        email: userData.email,
        avatar_url: userData?.avatar_url,
        cover_url: userData?.cover_url
    }
    })
})

//ROUTE: UPDATE USER DATA
router.put('/updateUser', fetchUser, uploadFiles, async(req,res)=>{
   try {
     if(res.headersSent) return 
 
     const id = req.user._id
     const user_data = await user.findById(id)
     if(!user_data) return res.status(409).json({error:"User not Found"})
 
     const { name } = req.body
 
     if( user_data.name!==name ){
         user_data.name = name
     }
     else{
        console.log("notChanged");
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
     console.log(avatar_data, cover_data, avatar_del_status, cover_del_status);
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


export default router
