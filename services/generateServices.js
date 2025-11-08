import { User } from "../model/userSchema.js";
import axios from "axios";
import { response } from "express";
import FormData from "form-data";
import { v2 as cloudinary } from 'cloudinary';
import { Images } from "../model/imageModel.js";




export const promptWordCountVerify = (prompt) => {
    if (!prompt || typeof prompt !== 'string') return false;
    // Split on spaces, filter out empty strings caused by multiple spaces
    const words = prompt.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length >= 4;
};




const setUserImgProcessingStatus = async (_id, status) => {
    try {
        await User.updateOne(
            { _id },
            { $set: { processImg: status } }
        );
    } catch (err) {
        console.log(err);
    }
}

export const decreaseUserCredits = async (_id) => {
    try {
        await User.updateOne(
            { _id },
            { $inc: { credits: -1 } } // Decrease usr credits by 1
        );
    } catch (err) {
        console.log(err);
    }
}





const saveNewImageForUser = async ({ _id, prompt, url }) => {
    try {
        return await Images.create({ generateBy: _id, prompt, imageUrl: url })
    } catch (error) {
        console.log(error);
    }
}






const callFun = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // reject('hhhh');
            resolve();
        }, 6000);
    })
}






cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const generateApiCall = async (_id, prompt) => {
    try {
        await setUserImgProcessingStatus(_id, true);
        await callFun();   /// after api call 

        console.log(prompt);

        /*
                const formData = new FormData();
                formData.append('prompt', prompt);
        
                const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1',
                    formData, {
                    headers: {
                        'x-api-key': process.env.CLIPDROP_KEY,
                    },
                    responseType: 'arraybuffer'
                })
                console.log(prompt);
                const baseImage = Buffer.from(data, 'binary').toString('base64');
                console.log(baseImage);
                const resultImg = `data:image/png;base64,${baseImage}`;
                console.log(resultImg);
                // const resultJpg = `data:image/png;base64,${baseImage}`;
        
        
                try {
                    const response = await cloudinary.uploader.upload(resultImg, { folder: 'vision_brush' });
                    console.log(response);
                    res.json(response);
                } catch (error) {
                    console.log('error:::::', error);
        
                }
        
        
        
        
                */

        const savedImage = await saveNewImageForUser({ _id, prompt, url: '/src/assets/1.jpg' });
        const newImage = {
            prompt,
            imageUrl: savedImage.imageUrl,
            isPublic: savedImage.isPublic,
            createdAt: savedImage.createdAt,
        };
        await setUserImgProcessingStatus(_id, false);
        return { success: true, newImage };

    } catch (error) {
        await setUserImgProcessingStatus(_id, false) /// if api fail image processing false
        console.log('error message : ', error);
        return { success: false, }
    }
}



