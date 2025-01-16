import express from 'express';
import { changeIsProvider, verifytoken, updateUserDetails } from '../Controllers/user.controller.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/changeIsProvider",authenticateToken, changeIsProvider);
Router.post("/verifytoken", verifytoken);
Router.post("/updateUserDetails",authenticateToken, updateUserDetails);

export default Router;
