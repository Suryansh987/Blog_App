import { v2 as cloudinary } from 'cloudinary';
import { cloud_name, cloud_api, api_secret } from '../conf/conf.js'
cloudinary.config({
    cloud_name: cloud_name,
    api_key: cloud_api,
    api_secret: api_secret
});


import fs from 'fs'

const unlinkFile = (filePath) => {
    fs.unlink(filePath, (error) => {
        if (error) {
            throw new Error(error.message)
        }
    })
}

const uploadAvatarImage = async (imagePath) => {
    try {
        const avatarData = await cloudinary.uploader.upload(imagePath, {
            folder: 'Avatar',
            resource_type: 'image'
        })
        unlinkFile(imagePath)
        return { avatar_url:avatarData.secure_url, avatar_id:avatarData.public_id}
    } catch (error) {
        unlinkFile(imagePath)
        return new Error(error.message)
    }
}

const uploadCoverImage = async (imagePath) => {
    try {
        const coverData = await cloudinary.uploader.upload(imagePath, {
            folder: 'Cover',
            resource_type: 'image'
        })
        unlinkFile(imagePath)
        return { cover_url:coverData.secure_url, cover_id:coverData.public_id}
    } catch (error) {
        unlinkFile(imagePath)
        return new Error(error.message)
    }
}

const uploadThumbnailImage = async (imagePath) => {
    try {
        const thumbnailData = await cloudinary.uploader.upload(imagePath, {
            folder: 'Thumbnail',
            resource_type: 'image'
        })
        unlinkFile(imagePath)
        return { thumbnail_url:thumbnailData.secure_url, thumbnail_id:thumbnailData.public_id}
    } catch (error) {
        unlinkFile(imagePath)
        return new Error(error.message)
    }
}

const deleteImage = async(public_id) => {
    try {
        const delete_status = await cloudinary.api.delete_resources([public_id], 
        { type: 'upload', resource_type: 'image' })
        return delete_status
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}


export { uploadAvatarImage, uploadCoverImage, uploadThumbnailImage, deleteImage }