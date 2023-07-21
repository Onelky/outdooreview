import process from 'process'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'outdooreview',
        allowed_formats: ['jpg', 'png']
        // format: async (req, file) => 'png', // supports promises as well
        // public_id: (req, file) => 'computed-filename-using-request'
    }
} as Options)
