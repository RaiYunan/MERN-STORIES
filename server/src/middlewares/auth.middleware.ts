import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer', '').trim();

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new ApiError(500, 'Server configuration error');
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, accessTokenSecret);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired access token');
    }

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid access token - User not found');
    }

    req.user = user;
    next();
  },
);
