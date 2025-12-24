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





const saveNewImageForUser = async ({ _id, userName, prompt, url }) => {
    try {
        return await Images.create({ generateBy: _id, userName, prompt, imageUrl: url })
    } catch (error) {
        console.log(error);
    }
}






const callFun = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // reject('hhhh');
            resolve();
        }, 5000);
    })
}






cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const generateApiCall = async (_id, userName, prompt) => {
    try {
        await setUserImgProcessingStatus(_id, true);
        // await callFun();   /// after api call 



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
        // console.log(baseImage);
        const resultImg = `data:image/png;base64,${baseImage}`;
        // console.log(resultImg);
        // const resultJpg = `data:image/png;base64,${baseImage}`;

        // let url = '../src/assets/1.jpg';
        let url = '';
        try {
            const response = await cloudinary.uploader.upload(resultImg, { folder: 'vision_brush' });
            // console.log(response);
            url = response.secure_url;
            console.log(url);

        } catch (error) {
            console.log('error:::::', error);

        }






        const savedImage = await saveNewImageForUser({ _id, userName, prompt, url });
        const newImage = {
            _id: savedImage._id,
            userName,
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



export const loadUserChat = async (userId) => {
    try {
        const data = await Images.find({ generateBy: userId }).select('_id userName prompt imageUrl isPublic createdAt'); // Correct filtering 
        return data;
    } catch (error) {
        // console.error('Error loading user chat:', error);
        return false;
    }
}

export const imageDelete = async ({ imageId, userId }) => {
    try {
        const { deletedCount } = await Images.deleteOne({ _id: imageId, generateBy: userId, }); // if it delete return 1 or 0
        return deletedCount;
    } catch (error) {
        // console.error('Error loading user chat:', error);
        return false;
    }
}


export const imagePublicPrivate = async ({ imageId, userId }) => {
    try {
        // Find image owned by user
        const image = await Images.findOne({ _id: imageId, generateBy: userId });

        if (!image) return false;

        image.isPublic = !image.isPublic;
        await image.save();
        const updatedImage = {
            _id: image._id,
            userName: image.userName,
            prompt: image.prompt,
            imageUrl: image.imageUrl,
            isPublic: image.isPublic,
            createdAt: image.createdAt,
        }
        return {
            success: true,
            updatedImage
        };

    } catch (error) {
        console.error('Error toggling image public/private:', error);
        return false;
    }
};


export const fetchCountPublicImages = async () => {
    try {
        const images = await Images.countDocuments(); // count all images 
        // const images = await Images.countDocuments({ isPublic: true });
        return {
            success: true,
            numberOfPublicImages: images
        };
    } catch (error) {
        console.error('Error count public : ', error);
        return false;
    }
};

export const fetchPublicImages = async (page, limit) => {
    try {
        const image = await Images
            .find() // send all images 
            // .find({ isPublic: true })
            .select('_id userName prompt imageUrl isPublic createdAt')
            .skip((page - 1) * limit)
            .limit(limit);
        return {
            success: true,
            publicImages: image
        };
    } catch (error) {
        console.error('Error toggling image public/private:', error);
        return false;
    }
};








