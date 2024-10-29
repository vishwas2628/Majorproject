import pkg from 'cloudinary'; // Importing the entire package as 'pkg'
const { v2: cloudinary } = pkg; // Destructuring to get the v2 instance

import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Correct import for CloudinaryStorage

// Configuring cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Creating a new CloudinaryStorage instance
export const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Using the configured cloudinary instance
    params: {
        folder: 'wonderlist_Dev', // Specifies the folder in Cloudinary
        allowedFormats: ["jpg", "png", "jpeg"], // Allowed image formats
    },
});
