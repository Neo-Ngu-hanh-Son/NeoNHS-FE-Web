import axios from "axios";

export const CLOUDINARY_CONFIG = {
    CLOUD_NAME: "dsrxsfr0q",
    PRESET_NAME: "demo-upload",
    FOLDER_NAME: "NeoNHS",
    API_URL: `https://api.cloudinary.com/v1_1/dsrxsfr0q/image/upload`,
    VIDEO_API_URL: `https://api.cloudinary.com/v1_1/dsrxsfr0q/video/upload`,
    AUDIO_API_URL: `https://api.cloudinary.com/v1_1/dsrxsfr0q/audio/upload`,
};

/**
 * Upload image to Cloudinary
 * @param file - File object or Blob to upload
 * @returns Secure URL of uploaded image or null if failed
 */
export const uploadImageToCloudinary = async (file: File | Blob | string): Promise<string | null> => {
    const {
        PRESET_NAME,
        FOLDER_NAME,
        API_URL
    } = CLOUDINARY_CONFIG;

    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);
    formData.append("file", file);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        //console.log("Uploaded image to Cloudinary:", response.data.secure_url);
        return response.data.secure_url;
    } catch (error) {
        //console.error("Upload image failed:", error);
        return null;
    }
};

/**
 * Upload video to Cloudinary
 * @param file - File object or Blob to upload
 * @returns Secure URL of uploaded video or null if failed
 */
export const uploadVideoToCloudinary = async (file: File | Blob): Promise<string | null> => {
    const {
        PRESET_NAME,
        FOLDER_NAME,
        VIDEO_API_URL
    } = CLOUDINARY_CONFIG;

    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);
    formData.append("file", file);

    try {
        const response = await axios.post(VIDEO_API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        //console.log("Uploaded video to Cloudinary:", response.data.secure_url);
        return response.data.secure_url;
    } catch (error) {
        //console.error("Upload video failed:", error);
        return null;
    }
};

export const uploadAudioToCloudinary = async (
    file: File | Blob
): Promise<string | null> => {
    const {
        PRESET_NAME,
        FOLDER_NAME,
        AUDIO_API_URL
    } = CLOUDINARY_CONFIG;

    const formData = new FormData();
    formData.append("upload_preset", PRESET_NAME);
    formData.append("folder", FOLDER_NAME);
    formData.append("file", file);

    try {
        const response = await axios.post(AUDIO_API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });

        //console.log("Uploaded audio to Cloudinary:", response.data.secure_url);
        return response.data.secure_url;

    } catch (error) {
        //console.error("Upload audio failed:", error);
        return null;
    }
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Error message if invalid, null if valid
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
};
