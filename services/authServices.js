import jwt from "jsonwebtoken";
import { User } from "../model/userSchema.js";
import argon2 from 'argon2';
import crypto from "crypto";
import 'dotenv/config'
import { sendVerificationMail } from "../lib/nodeMailer.js";
import { VerifyEmailTable } from "../model/vefifyEmailSchema.js";



//  Validate name: At least 4 letters, only alphabets (no numbers, no symbols)
export const nameVerify = (name) => {
    const regex = /^[A-Za-z]{4,}(?:\s[A-Za-z]+)*$/;
    return regex.test(name.trim());
};




// Regex for a basic email pattern
export const emailLengthVerify1 = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};



//strict email validation. such as .com, .in, .org, etc.
export const emailLengthVerify = (email) => {
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
export const isUserVerified = async (email) => {
    try {
        return await User.findOne({ email: email.trim().toLowerCase(), isVerified: true });
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

export const updateNewUser = async (name, email, password) => {
    try {
        const hashPW = await argon2.hash(password);

        return await User.findOneAndUpdate(
            { email: email.trim().toLowerCase() }, // Find user by email
            {
                name: name.trim(),
                password: hashPW,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { new: true } // Return updated document
        );
    } catch (error) {
        console.log(error);
        return null;
    }
}






export const verifyUserByPW = async (DbPassword, userPassword) => {
    const decodedPW = await argon2.verify(DbPassword, userPassword);
    return decodedPW; // if both match then return true else false 
}




export const generateJWToken = (user) => {
    try {
        const { _id, name, email, isVerified } = user;
        return jwt.sign({ _id, name, email, isVerified }, process.env.JWT_KEY)
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





export const generateVerificationToken = (size = 32) => {
    return crypto.randomBytes(size).toString("hex");
};

export const sendVerificationLink = async ({ _id, email, name }) => {
    const token = generateVerificationToken();
    try {
        await VerifyEmailTable.deleteOne({ user: _id }); // delete previous token 
        await VerifyEmailTable.create({ user: _id, token });
        const verificationLink = `http://localhost:3000/api/user/register/verify-email?userid=${_id}&token=${token}`;
        return sendVerificationMail({
            to: email,
            subject: 'Verify your email',
            html: `
            <!DOCTYPE html>
            <html>
            
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Email Verification</title>
                    </head>
                    
                    <body
                    style="margin:0; padding:0; background: linear-gradient(135deg, #f5f7fa, #e4ecf7); font-family: 'Segoe UI', Tahoma, sans-serif;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                      <td align="center" style="padding: 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                      style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
                              <tr>
                              <td style="background: linear-gradient(90deg, #155dfc, #4facfe); text-align: center;">
                              <h1 style="color: #ffffff; font-size: 24px;">Email Verification</h1>
                              </td>
                              </tr>
                              <tr>
                              <td style="padding: 30px;">
                              <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Welcome to Vision Brush</h1>
                              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                    Hi <strong>${name}</strong> (<span style="color: #155dfc;">${email}</span>),<br>
                                    Thank you for joining <span style="color: #ff7f50; font-weight: bold;">Vision Brush</span>!
                                    Please confirm your email address to unlock all the creative possibilities we offer.
                                    </p>
                                  <div style="text-align: center; margin: 30px 0;">
                                  <a href="${verificationLink}"
                                      style="background: linear-gradient(90deg, #2d88ff, #4facfe); color: #fff; padding: 14px 30px; border-radius: 30px; font-size: 16px; text-decoration: none; font-weight: bold; display: inline-block;">
                                      Verify Your Email
                                      </a>
                                      </div>
                                      <p style="color: #777; font-size: 14px; line-height: 1.5;">
                                      This link will expire in <strong>24 hours</strong>. If you didn’t sign up for VisionBrush, please
                                      ignore this email.
                                  </p>
                                </td>
                                </tr>
                                <tr>
                                <td style="background: #f8f8f8; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                                &copy; 2025 VisionBrush. All rights reserved.<br>
                                Bringing colors to your imagination.
                                </td>
                              </tr>
                              </table>
                              </td>
                              </tr>
                              </table>
                              </body>
                              
                    </html>
                `
        });
    } catch (error) {
        console.log(error);
        return false;

    }

}




export const verifyVerificationToken = async (userid, userToken) => {
    
    try {
        const userExist = await User.findOne({ _id: userid })
        if (!userExist) {
            return false;
        }
        const userTokenData = await VerifyEmailTable.findOne({ user: userExist._id });
        if (userTokenData) {
            const { token, expireAt } = userTokenData;
            if (userToken === token && new Date() < expireAt) {
                await User.updateOne({ _id: userExist._id }, { isVerified: true });  // if token match then for this user isVerified = true 
                await VerifyEmailTable.deleteOne({ user: userExist._id });
                return {email: userExist.email};
            }else{
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
        
    }
}




