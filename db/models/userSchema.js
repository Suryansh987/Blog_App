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
    profilePic :{
        type : String,
        lowercase : true,
        default : "https://res.cloudinary.com/dybwlpu9u/image/upload/v1706519441/Avatar/h2w4cdnhxo5opzpnyydq.png"
    },
    coverImage :{
        type : String,
        default : "https://res.cloudinary.com/dybwlpu9u/image/upload/v1706715946/Cover/mdrxyr6nuzx4t1vepio4.jpg"
    }
},{timestamps:true})

export const user = db.model("User",UserSchema,"Users")