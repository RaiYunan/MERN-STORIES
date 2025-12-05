import mongoose,{Document,Model,Schema} from "mongoose";

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    avatar?:string,
    createdAt:Date,
    updatedAt:Date
}

const userSchema=new Schema<IUser>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:""
    }
},{timestamps:true})

export const User:Model<IUser>=mongoose.model<IUser>("User",userSchema)