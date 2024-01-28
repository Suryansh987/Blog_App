import { log } from "console"
import multer from "multer"
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp/uploads')
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname)
        cb(null, `file${Date.now()}${extension}`)
        
    }
})

const upload = multer({ storage })

export default upload

