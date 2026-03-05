import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';

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

export const updateUserDetails=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const {removeAvatar,avatar,name,bio}=req.body

  const userId=req.user?._id;
  if(!userId){
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
  }
  


})
