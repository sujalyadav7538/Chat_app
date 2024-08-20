import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is Must']
    },
    firstName:{
        type:String,
        required:false,
        default:""
    },
    lastName:{
        type:String,
        required:false,
        default:""
    },
    image:{
        type:String,
        required:false,
        default:""
    },
    color:{
        type:Number,
        required:false,
        default:0
    },
    profileSetup:{
        type:Boolean,
        default:false
    }

});

UserSchema.pre('save',async function(next){
    const salt = await genSalt();
    this.password=await hash(this.password,salt);
    next();
})

const User=mongoose.model('User',UserSchema);

export default User;