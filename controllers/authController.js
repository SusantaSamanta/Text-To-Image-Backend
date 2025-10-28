
import {
    checkIsUserAlreadyExist,
    nameVerify,
    passwordLengthVerify,
    saveNewUser,
    verifyUserByPW,
    generateJWToken,
    getUserById,
    emailLengthVerify,
} from "../services/authServices.js";

export const postRegister = async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: 'All required fields must be provided.' });


    // if (!nameVerify(name))
    //     return res.status(422).json({ success: false, message: 'Invalid Usr name. Give at list 4 alphabet' });

    // if (!emailLengthVerify(email)) // change it to 2nd fun after testing or create the app 
    //     return res.status(422).json({ success: false, message: 'Invalid email format. Please enter a valid email like example@domain.com.' });

    // if (!passwordLengthVerify(password))
    //     return res.status(422).json({ success: false, message: 'Invalid password. Must be at least 8 characters, include one number and one symbol.' });

    if (await checkIsUserAlreadyExist(email))
        return res.status(409).json({ success: false, message: 'A user with this email already exists.' });

    const newUser = await saveNewUser(name, email, password);

    const token = generateJWToken(newUser)
    res.cookie("VISION_AUTH_TOKEN", token, { httpOnly: true, secure: false, maxAge: 7 * 60 * 60 * 1000 });

    return res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        user: {
            name: newUser.name,
            email: newUser.email,
            isVerified: newUser.isVerified,
            credits: newUser.credits,
            createdAt: newUser.createdAt,
        }
    });

};


export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(401).json({ success: false, message: `All required fields must be provided...!` });

    const isUserExist = await checkIsUserAlreadyExist(email);
    if (!isUserExist)   // user not exist 
        return res.status(401).json({ success: false, message: `Invalid user or password......!` });

    if (!await verifyUserByPW(isUserExist.password, password)) // password not match 
        return res.status(401).json({ success: false, message: `Invalid user or password......!` });

    const token = generateJWToken(isUserExist)
    res.cookie("VISION_AUTH_TOKEN", token, { httpOnly: true, secure: false, maxAge: 7 * 60 * 60 * 1000 });


    res.json({
        success: true,
        message: 'login successful....!',
        user: {
            name: isUserExist.name,
            email: isUserExist.email,
            isVerified: isUserExist.isVerified,
            credits: isUserExist.credits,
            createdAt: isUserExist.createdAt,
        }
    })
}

export const userCreditsBalance = async (req, res) => {
    if (!req.user) return res.status(400).json({ success: false, message: 'login require' });

    const user = await getUserById(req.user._id);

    if (!user) return res.status(400).json({ success: false, message: 'login require' });

    res.status(200).json({ success: true, credits: user.credits });
}

export const getCheck_Login = async (req, res) => {
    if (!req.user) {
        return res.json({ success: false, message: 'User not logged in....!' });
    }
    const userData = await getUserById(req.user._id);
    if (!userData) {
        return res.json({ success: false, message: 'No User Found, login again....!' });
    }
    const { name, email, isVerified, credits, createdAt } = userData
    res.json({
        success: true,
        message: 'User logged in....!',
        user: {
            name,
            email,
            isVerified,
            credits,
            createdAt,
        }
    });
}

export const userLogout = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not logged in!' });
        }

        res.clearCookie("VISION_AUTH_TOKEN", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.json({
            success: true,
            message: 'Logged Out Successfully!',
            user: {
                name: req.user.name,
                email: req.user.email,
            }
        });

    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error while logging out' });
    }
};

