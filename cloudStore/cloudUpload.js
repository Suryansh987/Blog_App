import {v2 as cloudinary} from 'cloudinary';
import {cloud_name,cloud_api,api_secret} from '../conf/conf.js'
cloudinary.config({ 
  cloud_name: cloud_name, 
  api_key: cloud_api, 
  api_secret: api_secret 
});

const uploadAvatarImage = async(imagePath)=>{
const response = await cloudinary.v2.uploader.upload(imagePath, {
  folder: 'Avatar',
  resource_type: 'image'
})
return response.secure_url
}

const uploadCoverImage = async(imagePath)=>{
  const response = await cloudinary.v2.uploader.upload(imagePath, {
    folder: 'Cover',
    resource_type: 'image'
  })
  return response.secure_url
  }


export {uploadAvatarImage, uploadCoverImage}