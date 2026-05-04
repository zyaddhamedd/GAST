import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  // We don't throw error here to prevent build-time crashes, 
  // but we should warn in dev.
  if (process.env.NODE_ENV === 'development') {
    console.warn('Cloudinary environment variables are missing');
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'products'
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `gast/${folder}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary upload failed: No result'));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an image from Cloudinary by its public_id or URL
 */
export async function deleteFromCloudinary(publicIdOrUrl: string) {
  try {
    let publicId = publicIdOrUrl;
    
    // If it's a full URL, extract the public ID
    if (publicIdOrUrl.startsWith('http')) {
      // Cloudinary URLs look like: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[filename].[ext]
      const parts = publicIdOrUrl.split('/');
      const filenameWithExt = parts.pop() || '';
      const filename = filenameWithExt.split('.')[0];
      const folderParts = parts.slice(parts.indexOf('upload') + 2); // Skip 'upload' and 'v12345'
      publicId = [...folderParts, filename].join('/');
    }

    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('[CLOUDINARY_DELETE_ERROR]', error);
  }
}

export default cloudinary;
