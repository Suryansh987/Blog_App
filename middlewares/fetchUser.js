import jwt from 'jsonwebtoken'
import { tokenSecret } from '../conf/conf.js'

const fetchUser = (req,res,next) =>{
    const btoken = req.cookies?.token
    if(btoken){
        const token = btoken.split(" ")[1]
        const user = jwt.verify(token,tokenSecret)
        req.user = user
    }
    next()
}

export default fetchUser