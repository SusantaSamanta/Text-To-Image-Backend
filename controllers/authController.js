
import { passwordLengthVerify, checkIsUserAlreadyExist, saveNewUser, verifyUserByPW } from "../services/authServices.js";

export const postRegister = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).send('All required fields must be provided.');

    if (!passwordLengthVerify(password))
        return res.status(400).send('Invalid, Give a strong password.');

    if (await checkIsUserAlreadyExist(email))
        return res.status(409).json({ success: false, message: "In this email user already exists...!" });

    const newUser = await saveNewUser(name, email, password);

    res.send(req.url);
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).send('All required fields must be provided.');

    const isUserExist = await checkIsUserAlreadyExist(email);
    if(!isUserExist)   // user not exist 
        return res.status(401).json({ success: false, massage: `Invalid user or password......` });
    
    if(!await verifyUserByPW(isUserExist.password, password)) // password not match 
        return res.status(401).json({ success: false, massage: `Invalid user or password......` });


    res.send(req.url)
}