import jwt from 'jsonwebtoken'
import { tokenSecret } from '../conf/conf.js'

const createJWT = (data)=>{
    const payload = {
        "_id":data._id,
        "_email":data.email
    }
    const token = jwt.sign(payload,tokenSecret)
    return token
}

export default createJWT