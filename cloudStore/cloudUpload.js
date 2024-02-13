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
        return avatarData.secure_url
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
        return coverData.secure_url
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
        console.log(thumbnailData);
        return thumbnailData.secure_url
    } catch (error) {
        unlinkFile(imagePath)
        return new Error(error.message)
    }
}

const deleteAvatarImage = (public_id) => {
    try {
        cloudinary.api.delete_resources([public_id], 
        { type: 'upload', resource_type: 'image' })
        .then(data=>{ console.log(data);} );
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}


export { uploadAvatarImage, uploadCoverImage, uploadThumbnailImage, deleteAvatarImage }