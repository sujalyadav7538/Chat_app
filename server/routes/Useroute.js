import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { UserLogOut, UserSetUp,DeleteImage } from '../controller/Usercontroller.js';

const route=express.Router();

route.post('/setUp',verifyToken,UserSetUp);
route.post('/removeimage',verifyToken,DeleteImage)
route.get('/logout',UserLogOut);

export default route;

