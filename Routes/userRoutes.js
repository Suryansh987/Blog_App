import { Router } from "express";
import uploadFiles from "../middlewares/files.js";
import hashPass from "../middlewares/hashPass.js";
import { user } from "../db/models/userSchema.js";
import {uploadAvatarImage, uploadCoverImage} from "../cloudStore/cloudUpload.js";

const router = Router()

router.post('/signup', uploadFiles, hashPass, async (req, res) => {
    if (res.headersSent) return
    const { email, name, password } = req.body
    if([email,name,password].some((value)=>{
        return value?.trim()===""
    })){
        return res.status(400).json({"error":"All feilds are Required"})
    }
    const {avatar,cover} = req.files
    let avatar_url,cover_url
    if(avatar){
        avatar_url = await uploadAvatarImage(avatar.path)
    }
    if(cover){
        cover_url = await uploadCoverImage(cover.path)
    }
    try {
        const newUser = await user.create({ name, email, password, avataravatar_url_url, cover_url })
        res.status(200).send(newUser)    
    } catch (err) {
        return res.status(409).send(err)
    }
    res.send("hello")
})

export default router
