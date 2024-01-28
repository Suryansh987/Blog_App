import bcrypt from 'bcryptjs'

const hashPass = (req,res,next)=>{
    const {password} = req.body
bcrypt.genSalt(10,(err,salt)=>{
    if(err){
        return res.status(500).json({"Error":err.message})
    }
    bcrypt.hash(password,salt, (err,hash)=>{
        if(err){
            return res.status(500).json({"Error":err.message})
        }
        req.body.password = hash
        next()
    })
})
}

export default hashPass