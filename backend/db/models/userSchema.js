import mongoose, { Schema} from "mongoose";
import { db_name } from "../../conf/conf.js";

const db = mongoose.connection.useDb(db_name)

const UserSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    avatar_url :{
        type : String,
        lowercase : true,
    },
    avatar_id : {
        type : String,
    },
    cover_url : {
        type : String,
    },
    cover_id : {
        type : String,
    }

},{timestamps:true})

export const user = db.model("User",UserSchema,"Users")




