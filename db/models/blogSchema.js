import mongoose,{ Schema } from "mongoose";
import { db_name } from "../../conf/conf.js";
const db = mongoose.connection.useDb(db_name)
const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    tag : {
        type : String,
    },
    thumbnail_url : {
        type : String,
    },
    thumbnail_id : {
        type : String,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true,
        index : true
    }
},{timestamps : true})

export const blog = db.model("Blog", blogSchema , "UserBlogs")