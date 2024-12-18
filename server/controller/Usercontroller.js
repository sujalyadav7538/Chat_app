import User from './../modals/UserModal.js';
export const UserSetUp=async(req,res,next)=>{
    try {
        const id=req.user;
        if(!id) return res.status(404).json({'message':'No User Found'});
        const data=req.body;
        console.log(data)
        const user=await User.findByIdAndUpdate(id,{...data,profileSetup:true},{new:true,timestamps:true});

        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)
    } catch (error) {
        next(error)
    }
};

export const  DeleteImage=async(req,res,next)=>{
    try {
        const  id=req.user;
        const user=await User.findByIdAndUpdate(id,{image:""},{new:true,timestamps:true});
        if(!user) return res.status(404).json({"message":"User Not Found"});
        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest);

    } catch (error) {
        next(error)
    }
}

export const UserLogOut=async(req,res,next)=>{
    try {
       res.clearCookie('jwt');
       res.status(200).json({'message':'Uer has benn loged out successfully!!'});
    } catch (error) {
        next(error)
    }
}