
import { response } from "express";
import { getUserById } from "../services/authServices.js";
import { promptWordCountVerify, generateApiCall, decreaseUserCredits } from "../services/generateServices.js";
import { v2 as cloudinary } from 'cloudinary';
import { join } from 'path'





export const imgProcessingController = async (req, res) => {
    if (!req.user) {
        return res.json({ success: false });
    }
    const userData = await getUserById(req.user._id);

    if (!userData) {
        return res.json({ success: false });
    }

    // console.log(req.url);
    res.json({ success: true, processImg: userData.processImg })
}






export const generateImg = async (req, res) => {

    const { prompt } = req.body;

    if (!prompt || !promptWordCountVerify(prompt)) // no prompt or length < 4
        return res.status(401).json({ success: false, message: 'Please give an prompt, contain at least 4 words...!' })

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Place login to generate image...!' });
    }

    const userData = await getUserById(req.user._id);

    if (!userData) {
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });
    }

    const { _id, name, email, isVerified, credits, createdAt, genImagesCount, processImg } = userData;

    if (processImg == true) {
        return res.status(401).json({ success: false, message: 'Please wait one image was processing....!' });
    }
    if (credits <= 0)
        return res.status(401).json({ success: false, case: 'credits-0', message: 'You have 0 credits remaining. Please purchase more credits to continue.' });



    const result = await generateApiCall(_id, prompt);
    if (result.success) {
        await decreaseUserCredits(_id); // if img generated and save in db successfully then decrease user credits from db | else not 
        return res.status(200).json({ success: true, user: { name, email, isVerified, credits: credits - 1, createdAt, genImagesCount }, newImage: result.newImage })
    } else {
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }

    console.log(result);
    console.log(req.url);

};






cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export const imgUpload = async (req, res) => {
    console.log(req.url);
    console.log(process.env.API_SECRET)

    const file = join(import.meta.dirname, '..', 'public', '1.jpg');
    console.log(file);

    //C:\Users\HP\Desktop\Vision Brush\server\public\4.jpg

    try {
        const response = await cloudinary.uploader.upload(file, { folder: 'vision_brush' });
        console.log(response);
        res.json(response);
    } catch (error) {
        console.log('error:::::', error);

    }
}


/*

{
  asset_id: '4d7d20fd4e1507f5bcf58cafac976b37',
  public_id: 'm2djyjeuyc7esdhwzwpk',
  version: 1753378561,
  version_id: '39f38a3f91eebdce4a21536058a433dc',
  signature: '567b81ce6b037448b600f03849fa74c1eb09c613',
  width: 720,
  height: 720,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2025-07-24T17:36:01Z',
  tags: [],
  bytes: 78178,
  type: 'upload',
  etag: 'ef3d249c46e096e09b5351089b979bd9',
  placeholder: false,
  url: 'http://res.cloudinary.com/diznagcfg/image/upload/v1753378561/m2djyjeuyc7esdhwzwpk.jpg',
  secure_url: 'https://res.cloudinary.com/diznagcfg/image/upload/v1753378561/m2djyjeuyc7esdhwzwpk.jpg',
  asset_folder: '',
  display_name: 'm2djyjeuyc7esdhwzwpk',
  original_filename: '4',
  api_key: '796314566168257'
}






*/




