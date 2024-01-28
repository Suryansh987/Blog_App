import upload from '../conf/multerConf.js'

const uploadFiles = (req,res,next) =>{
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        }
    ])(req,res, (err) =>{
        if(err){
            res.status(400).send({"MULTER":err.message})
        }
        next()
    })
}

export default uploadFiles