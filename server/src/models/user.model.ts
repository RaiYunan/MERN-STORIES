import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    avatar?:string;
    authProvider:String;
    createdAt:Date;
    updatedAt:Date;
    isPasswordCorrect(password:string):Promise<boolean>;
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
    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local"

    }
},{timestamps:true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.isPasswordCorrect=async function(password:string){
    return await bcrypt.compare(password,this.password)
}

export const User:Model<IUser>=mongoose.model<IUser>("User",userSchema)