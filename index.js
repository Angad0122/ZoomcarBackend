import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connection from './db.js';
import dotenv from 'dotenv'

import authRoute from "./Routes/auth.routes.js";
import userRoute from "./Routes/user.routes.js";
import carRoute from "./Routes/car.routes.js";
import adminRoutes from "./Routes/admin.routes.js"



dotenv.config()
const app = express()

app.use(cors({
    origin:true, //`http://localhost:5173`, Match the frontend origin
    credentials: true  
}));


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/car', carRoute);
app.use('/admin',adminRoutes)

connection()
let port = 8080;

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);  
})
