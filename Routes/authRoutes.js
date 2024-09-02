import express from 'express';
import { signup, login, verifyOtp, verifyloginotp } from '../Controllers/authController.js';
const Router = express.Router();

Router.post("/signup", signup);
Router.post("/login", login);
Router.post("/verify-otp", verifyOtp);
Router.post("/verifyloginotp", verifyloginotp);

export default Router;
