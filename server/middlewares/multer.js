import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        console.log(file)
        cb(null,'E:/CODES/chat-app/public')
    },
    filename: function (_,file,cb){
        cb(null,file.originalname)
    }
})

export const upload = multer({storage})