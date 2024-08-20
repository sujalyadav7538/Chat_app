import { Router } from "express";
import { Login, SingUp } from "../controller/Authcontroller.js";

const route =Router();

route.post('/singup',SingUp);
route.post('/login',(req,res,next)=>{
    console.log('Logining');
    next();
},Login);

export default route;