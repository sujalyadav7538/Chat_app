import { Router } from "express";
import { Login, SingUp ,getUserinfo } from "../controller/Authcontroller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const route =Router();

route.post('/singup',SingUp);
route.post('/login',Login);
route.get('/userinfo',verifyToken,getUserinfo)

export default route;