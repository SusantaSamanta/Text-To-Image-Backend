import express from 'express';
const app = express();
import 'dotenv/config';
import { authRoutes } from './routes/authRoutes.js';


import { connectDataBase } from './config/DB-connection.js';
connectDataBase();



// app.use(express.urlencoded()); // it use to hide data in url bar 
app.use(express.json());  // it mandatory to receive data from body 


app.get('/', (req, res) => {
    res.send('Server running');
});

app.use('/api/user', authRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`sever run on http://localhost:${PORT}`);
})


