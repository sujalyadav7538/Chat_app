import jwt from "jsonwebtoken";
import User from './../modals/UserModal.js';
import bcrypt, { genSalt } from "bcrypt";

const maxAge=3*24*60*60*1000;
const creatToken=(email,userId)=>{
   return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge });
}

export const SingUp=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).send('Email and Password Both are Required !');
        }
        const isUser = await User.findOne({email:email});
        if(isUser) return res.status(402).json({'message':'User Already Exist'});
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({email,password:hashedPassword});
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
        if(!email || !password){
            return res.status(401).send('Email and Password Both are Required !');
        }
        console.log(email,password)
        const user=await User.findOne({email:email});
        console.log("HERE",user)
        if(!user){
            return res.status(401).json({'message':'User Not found!'});
        }
        console.log(user)
        const auth=await bcrypt.compare(password,user.password);
        if(!auth){
            return res.status(404).send('Invalid Credentials!')
        }
        console.log('able to reach here')
        res.cookie('jwt',creatToken(email,user._id),{
            maxAge,
            secure:true,
            sameSite:'None'
        });
        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)

    } catch (error) {
        console.log('This error',error)
        next(error)
    }
}


export const getUserinfo=async(req,res,next)=>{
    try {
        const userId=req.user;
        if (!userId) return res.status(401).json({message:'No User Found!'});
        
        const user=await User.findById(userId);

        if (!user) return res.status(404).json({messgae:'User Not Found'});

        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)

    } catch (error) {
        next(error)
    }
}