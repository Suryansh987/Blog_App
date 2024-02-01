import jwt from 'jsonwebtoken'
import { tokenSecret } from '../conf/conf.js'

const createJWT = (data)=>{
    try {
        const payload = {
            "_id":data._id,
            "_email":data.email
        }
        const token = jwt.sign(payload,tokenSecret)
        return token
    } catch (error) {
        return resizeBy.status(500).json({"error":error.message})
    }
}

export default createJWT