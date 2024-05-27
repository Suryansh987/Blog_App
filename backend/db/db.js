import mongoose from 'mongoose'
import { mongo_url } from '../conf/conf.js'
const connectToDb = async() =>{
    try {
        await mongoose.connect(mongo_url)
        return true
    } catch (error) {
        return false
    }

}

export default connectToDb