import mongoose from "mongoose";
import 'dotenv/config';

export const connectDataBase = async () => {
    // console.log(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log('Database Connected Successfully.......\n');
    } catch (error) {
        console.log('Database connection fail.......', error);
    }
}