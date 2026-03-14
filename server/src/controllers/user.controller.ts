import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { User } from '../models/user.model';
import fs from 'fs';

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    if (!userId) {
      throw new ApiError(404, 'User ID is missing!');
    }

    const user = await User.findById(userId);
    console.log('Getting user:- ', user);
    res
      .status(200)
      .json(new ApiResponse(200, user, 'User details fetched Successfuly!'));
  },
);

export const updateUserBio = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const bio = req.body.bio?.trim();

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!bio) {
      throw new ApiError(400, 'Bio is required');
    }

    if (bio.length > 300) {
      throw new ApiError(400, 'Bio must be under 300 characters');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      {
        new: true,
        runValidators: true,
        select: 'bio name email avatar',
      },
    );

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, 'Bio updated successfully'));
  },
);

export const updateUserDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, bio, removeAvatar } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updates: {
      name?: string;
      bio?: string;
      avatar?: string | null;
    } = {};

    if (name && name.trim()) {
      updates.name = name.trim();
    }

    
    if (bio !== undefined) {
      
      updates.bio = bio.trim();
    }

   
    if (removeAvatar === 'true' || removeAvatar === true) {
      console.log('Removing avatar...');

      
      if (user.avatar) {
        try {
          
          const publicId = extractPublicIdFromUrl(user.avatar);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        } catch (error) {
          console.error('Error deleting old avatar from Cloudinary:', error);
        }
      }

      updates.avatar = null;
    }
    
    else if (req.file) {
      console.log('Uploading new avatar...');

      try {
       
        const uploadResult = await uploadOnCloudinary(req.file.path);

        if (!uploadResult) {
          throw new ApiError(500, 'Failed to upload avatar to Cloudinary');
        }

        
        if (user.avatar) {
          try {
            const publicId = extractPublicIdFromUrl(user.avatar);
            if (publicId) {
              await deleteFromCloudinary(publicId);
            }
          } catch (error) {
            console.error('Error deleting old avatar:', error);
          }
        }

        updates.avatar = uploadResult.secure_url;
      } catch (error) {
        
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        throw new ApiError(500, 'Failed to upload avatar');
      }
    }

   
    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No updates provided');
    }

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('-password -refreshToken');

    if (!updatedUser) {
      throw new ApiError(500, 'Failed to update user');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
  },
);

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
  try {
   
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    
    const fileWithExtension = parts.slice(uploadIndex + 2).join('/');

   
    const publicId = fileWithExtension.substring(
      0,
      fileWithExtension.lastIndexOf('.'),
    );

    return publicId || null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

// Helper function to delete from Cloudinary
async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    const { v2: cloudinary } = await import('cloudinary');
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}
