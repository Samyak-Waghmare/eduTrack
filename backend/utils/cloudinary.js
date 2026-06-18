import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadMedia = async (file) => {
    try {
        const isVideo = file.match(/\.(mp4|mov|avi|wmv|mkv)$/i);
        
        const uploadOptions = {
            resource_type: "auto",
        };

        if (isVideo) {
            uploadOptions.eager = [
                { streaming_profile: "hd", format: "m3u8" }
            ];
            uploadOptions.eager_async = true;
        }

        const uploadResponse = await cloudinary.uploader.upload(file, uploadOptions);
        
        if (uploadResponse.eager && uploadResponse.eager.length > 0) {
            uploadResponse.hlsUrl = uploadResponse.eager[0].secure_url;
        }
        
        return uploadResponse;
    } catch (error) {
        throw error;
    }
};

export const uploadRawMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "raw",
        });
        return uploadResponse;
    } catch (error) {
        throw error;
    }
};

export const generateSignedUrl = (publicId, resourceType = "video") => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        public_id: publicId
    }, process.env.CLOUDINARY_API_SECRET);

    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/s--${signature.substring(0, 8)}--/v${timestamp}/${publicId}`;
};

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
    }
};

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
    }
};
