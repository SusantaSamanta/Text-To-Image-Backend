import express from 'express';
const app = express();
import 'dotenv/config';
import cors from 'cors'
import { authRoutes } from './routes/authRoutes.js';


import { connectDataBase } from './config/DB-Connection.js';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/authMiddleware.js';
import { generateRoutes } from './routes/ImageRoutes.js';
connectDataBase();



// app.use(express.urlencoded()); // it use to hide data in url bar 
app.use(express.json());  // it mandatory to receive data from body 
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        exposedHeaders: ['X-Total-Count'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }
));  // use for connect frontend and backend
app.use(cookieParser()); ///  use for set and get cookies from backend 

app.get('/', (req, res) => {
    console.log('home', req.url);
    res.send('Server running');
});




app.use('/api/user', authRoutes); // auth routes register, login...
app.use('/api/image', generateRoutes);  //use for generate user image 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`sever run on http://localhost:${PORT}`);
})


