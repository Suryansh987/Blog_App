import jwt from 'jsonwebtoken'
import { tokenSecret } from '../conf/conf.js'

const fetchUser = (req,res,next) =>{
    const btoken = req.cookies?.token
    if(!btoken){
        return res.status(409).json({"error":"Please Login First"})
    }
    const token = btoken.split(" ")[1]
    try {
        const user = jwt.verify(token,tokenSecret)
        req.user = user
    } catch (error) {
        return res.status(409).json({"error":error.message})
    }
    next()
}

export default fetchUser