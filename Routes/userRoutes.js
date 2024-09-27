import express from 'express';
import { changeIsProvider, verifytoken } from '../Controllers/userController.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/changeIsProvider",authenticateToken, changeIsProvider);
Router.post("/verifytoken", verifytoken);


export default Router;
