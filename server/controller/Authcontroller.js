import jwt from "jsonwebtoken";
import User from './../modals/UserModal.js';
import { compare } from "bcrypt";

const maxAge=3*24*60*60*1000
const creatToken=(email,userId)=>{
   return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge });
}

export const SingUp=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).send('Email and Password Both are Required !');
        }

        const user=await User.create({email,password});
        res.cookie('jwt',creatToken(email,user._id),{
            maxAge,
            secure:true,
            sameSite:'None'
        });
        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)

    } catch (error) {
        next(error)
    }
};

export const Login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        console.log(email,password)
        if(!email || !password){
            return res.status(401).send('Email and Password Both are Required !');
        }

        const user=await User.findOne({email:email});
        if(!user){
            return res.status(401).send('User Not found!');
        }
        const auth=await compare(password,user.password);
        if(!auth){
            return res.status(404).send('Invalid Credentials!')
        }
        res.cookie('jwt',creatToken(email,user._id),{
            maxAge,
            secure:true,
            sameSite:'None'
        });
        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)

    } catch (error) {
        next(error)
    }
}