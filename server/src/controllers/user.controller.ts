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

    const user=await User.findById(userId);
    console.log("Getting user:- ",user);
    res.status(200).json(new ApiResponse(200,user,"User details fetched Successfuly!"));
  },
);
