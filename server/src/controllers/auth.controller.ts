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

    return { user, accessToken, refreshToken };
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
      throw new ApiError(
        400,
        'This email is already registered. Try signing in instead.',
      );
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
  async (req: Request, res: Response, _next: NextFunction) => {
    const { token } = req.body;

    /* 1. Validate input                                                   */
    if (!token || typeof token !== 'string') {
      throw new ApiError(400, 'OAuth token is required');
    }

    /* 2. Verify Firebase ID token (revocation-aware)                      */
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    console.log('decodedToken:- ', decodedToken);

    /* 3. Fetch authoritative Firebase user                                */
    const firebaseUser = await admin.auth().getUser(decodedToken.uid);
    console.log('Firebase User:- ', firebaseUser);

    const email = firebaseUser.email;
    if (!email) {
      throw new ApiError(400, 'Email unavailable from OAuth provider');
    }

    /* 4. Extract linked providers from Firebase                           */
    const providers = firebaseUser.providerData
      .map((p) => p.providerId)
      .filter(Boolean);

    console.log('Providers', providers);
    if (providers.length === 0) {
      throw new ApiError(400, 'No OAuth providers linked to this account');
    }

    const providerId = providers[0];
    const PROVIDER_MAP: Record<string, 'Google' | 'Facebook'> = {
      'google.com': 'Google',
      'facebook.com': 'Facebook',
    };

    const authProvider = PROVIDER_MAP[providerId];
    if (!authProvider) {
      throw new ApiError(400, 'Unsupported OAuth provider');
    }

    /* 5. Find or create application user                                  */
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: firebaseUser.displayName || '',
        avatar: firebaseUser.photoURL || '',
        authProvider,
        providers,
      });
    } else {
      user.authProvider = authProvider;
      user.providers = providers;
      if (!user.name && firebaseUser.displayName) {
        user.name = firebaseUser.displayName;
      }

      if (!user.avatar && firebaseUser.photoURL) {
        user.avatar = firebaseUser.photoURL;
      }

      await user.save();
    }
    /* 6. Generate application tokens                                      */
    const { user:updatedUser, accessToken, refreshToken } = await generateAccessRefreshTokens(
      user._id.toString(),
    );

    console.log('Loggedin USer:- ',updatedUser);
    /* 7. Send response                                                    */
    res
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, user, 'User authenticated successfully'));
  },
);


export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log("Cookies:_ ", req.cookies)
    console.log("refreshToken:_ ",refreshToken);

    const user=await User.findOne({refreshToken:refreshToken});
    console.log("Logged out user:- ",user)
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } },
      );
    }

    res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  },
);
