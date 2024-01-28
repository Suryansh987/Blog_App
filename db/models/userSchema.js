import mongoose, { Schema} from "mongoose";
import { db_name } from "../../conf/conf.js";

const db = mongoose.connection.useDb(db_name)

const UserSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    ProfilePic :{
        type : String,
        
    }
},{timestamps:true})

export const user = db.model("User",UserSchema,"Users")