import { Router } from "express";
import uploadFiles from "../middlewares/files.js";
import hashPass from "../middlewares/hashPass.js";
import { user } from "../db/models/userSchema.js";
import {uploadAvatarImage, uploadCoverImage} from "../cloudStore/cloudUpload.js";
import createJWT from "../controller/jwt.controller.js";
import verifyPass from "../controller/pass.controller.js";
import {validateRegisterData, validateLoginData} from "../middlewares/validate.js";

const router = Router()

//ROUTE : FOR USER SIGNUP with NAME, EMAIL, PASS, AVATAR,COVERIMAGE(POST)
router.post('/signup', uploadFiles, validateRegisterData, hashPass, async (req, res) => {
    if (res.headersSent) return
    const { email, name, password } = req.body 
    const {avatar, cover} = req.files
    let avatar_url,cover_url
    if(avatar){
        avatar_url = await uploadAvatarImage(avatar[0].path)
    }
    if(cover){
        cover_url = await uploadCoverImage(cover[0].path)
    }
    try {
        const newUser = await user.create({ name, email, password, 'profilePic':avatar_url, "coverImage":cover_url })
        const token = createJWT(newUser)
        res
    .status(200)
    .cookie('token', `Bearer ${token}`,{
        httpOnly : true,
        secure : true
    })
    .send("Signedin Successfully")    
    } catch (err) {
        return res.status(409).json({"error":err.message})
    }
})

//ROUTE : FOR USER LOGIN WITH EMAIL AND PASS(POST)
router.post('/login', validateLoginData, async(req,res)=>{
    const {email,password} = req.body
    const userData = await user.findOne({email})
    if(!userData){ return res.status(400).json({"error":"Please create a account first"}) }
    const result = await verifyPass(password, userData.password)
    if(!result){
        res.status(401).json({"error":"Invalid Credentials"})
    }
    const token = createJWT(userData)
    res
    .status(200)
    .cookie('token', `Bearer ${token}`,{
        httpOnly : true,
        secure : true
    })
    .send("Logged in Successfully")
})

export default router
