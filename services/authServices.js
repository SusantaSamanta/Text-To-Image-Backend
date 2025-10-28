import jwt from "jsonwebtoken";
import { User } from "../model/userSchema.js";
import argon2 from 'argon2';
import 'dotenv/config'



//  Validate name: At least 4 letters, only alphabets (no numbers, no symbols)
export const nameVerify = (name) => {
    const regex = /^[A-Za-z]{4,}(?:\s[A-Za-z]+)*$/;
    return regex.test(name.trim());
};




// Regex for a basic email pattern
export const emailLengthVerify = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};



//strict email validation. such as .com, .in, .org, etc.
export const emailLengthVerify1 = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};




//  Validate password: At least 8 chars, 1 number, 1 special char, no spaces
export const passwordLengthVerify = (password) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/;
    return regex.test(password);
};




export const checkIsUserAlreadyExist = async (email) => {
    try {
        return await User.findOne({ email: email.trim().toLowerCase() });
    } catch (error) {
        console.log(error);
        return true;
    }
}



export const saveNewUser = async (name, email, password) => {
    const hashPW = await argon2.hash(password);
    try {
        return await User.create({ name: name.trim(), email, password: hashPW })
    } catch (error) {
        console.log(error);
    }
}




export const verifyUserByPW = async (DbPassword, userPassword) => {
    const decodedPW = await argon2.verify(DbPassword, userPassword);
    return decodedPW; // if both match then return true else false 
}




export const generateJWToken = (user) => {
    try {
        const { _id, name, email, isVerified} = user;
        return jwt.sign({ _id, name, email, isVerified}, process.env.JWT_KEY)
    } catch (error) {
        console.log(error);
    }
}

export const decodedJWToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY)
    } catch (error) {
        console.log(error);
    }
}



export const getUserById = async (id) => {
    try {
        return await User.findOne({ _id: id })
    } catch (error) {
        return false;
    }
}
