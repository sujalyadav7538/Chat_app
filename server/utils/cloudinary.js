import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name:'dnkt2ibbx',
  api_key: '486333456185256',
  api_secret:'hFjnlBecMyvPI5VLFPLPmECjgvY',
  secure: true,
})

const uploadOnCloud = async (localFilePath) => {
  try {
      if (!localFilePath) return null
      //upload the file on cloudinary
      // console.log('loaclPath',localFilePath)
      const response = await cloudinary.v2.uploader.upload(localFilePath, {
          resource_type: "auto"
      })
      // file has been uploaded successfull
      // console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath)
      return response;

  } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      console.log(error)
  }
}



export {uploadOnCloud}