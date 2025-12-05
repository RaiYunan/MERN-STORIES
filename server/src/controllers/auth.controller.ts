import { Request , Response,NextFunction} from "express";
import { asyncHandler } from "../utils/AsyncHandler";

export const registerUser=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.send("User registered Successfully");
})