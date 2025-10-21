import { User } from "../model/userSchema.js";
import argon2 from 'argon2';

export const passwordLengthVerify = (password) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/;
    return regex.test(password);
};

export const checkIsUserAlreadyExist = async (email) => {
    try {
        return await User.findOne({ email: email });
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const saveNewUser = async (name, email, password) => {
    const hashPW = await argon2.hash(password);
    try {
        return await User.create({name, email, password: hashPW})
    } catch (error) {
        console.log(error);
    }
}


export const verifyUserByPW = async (DbPassword, userPassword) => {
    const decodedPW = await argon2.verify(DbPassword, userPassword);
    return decodedPW; // if both match then return true else false 
}
