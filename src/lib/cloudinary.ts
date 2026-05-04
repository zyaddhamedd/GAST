import { v2 as cloudinary } from 'cloudinary';

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
  console.error('[CLOUDINARY CONFIG ERROR] Missing variables:', {
    has_cloud_name: !!cloud_name,
    has_api_key: !!api_key,
    has_api_secret: !!api_secret
  });
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
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
