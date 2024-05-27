import bcrypt from 'bcryptjs'

const verifyPass = async(enteredPassword , hashPassword)=>{
    const result = await bcrypt.compare(enteredPassword,hashPassword)
    return result
}

export default verifyPass