import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
const jwt = require("jsonwebtoken");

import { 
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
} from "../config/env";


export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  authProvider: string;
  providers: string[];
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      trim:true,
      required: function(this: IUser) {
        return this.authProvider === 'local';
      },
    },
    avatar: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google','facebook','oauth'],
      default: 'local',
    },
    providers: [{ type: String }],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.isPasswordCorrect=async function(password:string):Promise<boolean>{
  return bcrypt.compare(password,this.password)

}
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);