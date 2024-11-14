import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connection from './db.js';
import dotenv from 'dotenv'

import authRoute from "./Routes/authRoutes.js";
import userRoute from "./Routes/userRoutes.js";
import carRoute from "./Routes/carRoutes.js";



dotenv.config()
const app = express()

app.use(cors({
    origin: `http://localhost:5173`,  // Match the frontend origin
    credentials: true  
}));


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/car', carRoute);

connection()
let port = 8080;

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);  
})
