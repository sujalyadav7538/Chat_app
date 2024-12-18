import express from 'express';
import { upload } from '../middlewares/multer.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadOnCloud } from '../utils/cloudinary.js';
const route=express.Router();

route.post('/*',upload.single('profile_image'),verifyToken,
      async (req,res,next) =>{
        try {
          console.log(req.file)
            const profile_image=req.file
            const uploadedUrl=await uploadOnCloud(profile_image.path);
            res.json({'url':uploadedUrl.url})
        } catch (error) {
            console.log('Error',error)
            next(error.message)
        }
      }  
)

export default route;