import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const sameSiteOption: 'none' | 'lax' | 'strict' =
  process.env.NODE_ENV === 'production' ? 'none' : 'lax';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: sameSiteOption,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens');
  }
};
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      console.log('Duplicate User found.', existedUser);
      throw new ApiError(400, 'User with given email already exists.');
    }

    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const createdUser = await User.findById(user._id).select('-password');

    res
      .status(200)
      .json(new ApiResponse(200, createdUser, 'User registered successfully'));
  },
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(
        404,
        'No account found with this email. Please sign up to continue.',
      );
    }

    if (user.authProvider !== 'local') {
      throw new ApiError(
        400,
        `This account was created with ${user.authProvider}.Please login with ${user.authProvider}.`,
      );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(400, 'Password is incorrect! Try again!!');
    }

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
      user._id.toString(),
    );

    const loggedInUser = await User.findById(user._id).select(
      '-password -refreshToken',
    );

    res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(new ApiResponse(200, loggedInUser, "User logged in successfully."));
  },
);
