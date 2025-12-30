import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import admin from '../config/firebaseAdmin';

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
      .json(new ApiResponse(200, loggedInUser, 'User logged in successfully.'));
  },
);

export const oauthLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const { token } = req.body;
    console.log("token",token)

    // Verify the Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("decoded: ",decoded)
    const { email, name, picture, firebase } = decoded;
    
    // Get the provider info (e.g., 'google.com' or 'facebook.com')
    const provider = firebase.sign_in_provider;
    
    if (!email) {
      throw new ApiError(400, 'Email not provided by authentication provider');
    }

    // Find existing user by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with the provider
      user = await User.create({
        email,
        name,
        avatar: picture || '',
        authProvider: 'oauth', // or map provider to 'google'/'facebook'
        providers: [provider],
      });
      
      console.log(`New user created with ${provider}:`, email);
    } else {
      // User exists - merge accounts
      console.log(`Existing user found:`, email);
      console.log(`Current providers:`, user.providers);
      
      // Add provider if not already added
      if (!user.providers) {
        user.providers = [provider];
      } else if (!user.providers.includes(provider)) {
        user.providers.push(provider);
        console.log(`Added ${provider} to user's providers`);
      } else {
        console.log(`${provider} already linked`);
      }
      
      // Update name if user doesn't have one or if it's different
      if (!user.name || user.name !== name) {
        user.name = name;
      }
      
      // Update avatar if provided and user doesn't have one
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      
      // Update authProvider to 'oauth' if it was 'local' before
      if (user.authProvider === 'local') {
        user.authProvider = 'oauth';
      }
      
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessRefreshTokens(
      user._id.toString(),
    );

    // Send response
    const message = user.providers.length > 1 
      ? `Accounts linked successfully! You can now sign in with ${user.providers.join(' or ')}.`
      : 'User logged in successfully.';

    res
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(new ApiResponse(200, user, message));
  },
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized - User is not authenticated.');
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true },
    );

    res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  },
);