import mongoose, { Document, Schema, Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone:string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: "user" | "manager" | "admin";
    isActive:boolean;
    hostel?: mongoose.Types.ObjectId;
    hostelRequestStatus: "none" | "pending" | "approved" | "rejected";
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken : ()=>string;
    SignRefreshToken : ()=>string;

}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value: string) => emailRegexPattern.test(value),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        minlength: [6, "Password must be atleast 6 characters"],
        select: false,
    },
   phone: {
     type: String,
     required: true,
     trim: true,
     match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"]
},
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user"
    },
    isActive: {
    type: Boolean,
    default: false
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
    },
    hostelRequestStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none"
    }

}, { timestamps: true });



userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.SignAccessToken = function(){
    return jwt.sign({id:this._id} , process.env.ACCESS_TOKEN || "")
}

userSchema.methods.SignRefreshToken = function(){
    return jwt.sign({id:this._id} , process.env.REFRESH_TOKEN || "")
}

userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;
