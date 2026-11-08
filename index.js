import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import { authRoutes } from './routes/authRoutes.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { connectDataBase } from './config/DB-Connection.js';
import cookieParser from 'cookie-parser';
import { generateRoutes } from './routes/ImageRoutes.js';
connectDataBase();

const app = express();
app.set('trust proxy', 1); // 1 = number of proxies between user and server

// app.use(express.urlencoded()); // it use to hide data in url bar 
app.use(express.json());  // it mandatory to receive data from body 
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || 'https://text-to-image-frontend-b7ah.onrender.com',
        exposedHeaders: ['X-Total-Count'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }
));  // use for connect frontend and backend
app.use(cookieParser()); ///  use for set and get cookies from backend 



app.use(globalLimiter);


// async function wait() {
//   return new Promise((resolve) => {
//     setTimeout(resolve, 6000);
//   });
// }
app.get('/', async (req, res) => {
    // console.log('home', req.url);
    // await wait();
    return res.status(200).json({ success: true, stats: "Server running...." });
});

app.get('/ip', (req, res) => {
    res.json({ ip: req.ip });
});




app.use('/api/user', authRoutes); // auth routes register, login...
app.use('/api/image', generateRoutes);  //use for generate user image 


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

