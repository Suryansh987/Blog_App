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
router.post('/signup', validateRegisterData, hashPass, async (req, res) => {

    if (res.headersSent) return

    const { email, name, password } = req.body 
    
    try {
        const newUser = await user.create({ name, email, password })
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

    if(!userData){ return res.status(400).json({"error":"Invalid"}) }

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

router.post('/updateavatar', uploadFiles, fetchUser, async (req, res) => {

    if (res.headersSent) return;

    const id = req.user._id;
    const avatar = req.files?.avatar;
    
    
    if (!avatar) {
        return res.status(400).json({ error: "Avatar is Required" });
    }
    
    const avatar_path = avatar[0].path;

    const user_data = await user.findById(id);
    if(!user_data) return res.status(409).json({error:"Not a Valid User"})

    // Start both operations concurrently
    const [uploadPromise, deletePromise] = [
        uploadAvatarImage(avatar_path),
        user_data.avatar_id ? deleteImage(user_data.avatar_id) : Promise.resolve(null)
    ];

    try {
        // Wait for both promises to resolve
        const [upload_data, delete_status] = await Promise.all([uploadPromise, deletePromise]);

        // Update user data with new avatar information
        const { avatar_url, avatar_id } = upload_data;
        user_data.avatar_url = avatar_url;
        user_data.avatar_id = avatar_id;
        await user_data.save({ validateBeforeSave: false });

        // Send response after both processes are completed
        res.json({upload_data,delete_status});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/updateCover' , fetchUser, uploadFiles, async(req,res)=>{

    if(res.headersSent) return
    const cover = req.files?.cover
    if(!cover){
        res.status(400).json({error:"Cover Image is mandatory"})
    }

    const cover_path = cover[0].path
    const id = req.user._id
    const user_data = await user.findById(id)

    if(!user_data) return res.status(409).json({error:"Not a valid User"})

        // Start both operations concurrently
        const [uploadPromise, deletePromise] = [
            uploadCoverImage(cover_path),
            user_data.cover_id ? deleteImage(user_data.cover_id) : Promise.resolve(null)
        ];
    
        try {
            // Wait for both promises to resolve
            const [upload_data, delete_status] = await Promise.all([uploadPromise, deletePromise]);
    
            // Update user data with new avatar information
            const { cover_url, cover_id } = upload_data;
            user_data.cover_url = cover_url;
            user_data.cover_id = cover_id;
            await user_data.save({ validateBeforeSave: false });
    
            // Send response after both processes are completed
            res.json({upload_data,delete_status});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    

}) 

export default router
