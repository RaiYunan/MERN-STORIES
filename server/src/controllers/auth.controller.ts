import { Request , Response,NextFunction} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const registerUser=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password}=req.body;

    const existedUser=await User.findOne({email:email});
    if(existedUser){
        console.log("Duplicate User found.",existedUser);
        throw new ApiError(400,"User with given email already exists.")
    }

    const user=await User.create({
        name:name,
        email:email,
        password:password
    })
    
    const createdUser=await User.findById(user._id).select("-password");

    res.status(200).json(new ApiResponse(200,createdUser,"User registered successfully"))
})