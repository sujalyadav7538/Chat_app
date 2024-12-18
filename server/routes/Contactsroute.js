import express from 'express';
import { searchContacts } from '../controller/ContactController.js';
import { verifyToken } from './../middlewares/verifyToken.js';

const route=express.Router();

route.post('/search',verifyToken,searchContacts);

export default route;   