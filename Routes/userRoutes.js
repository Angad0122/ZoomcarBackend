import express from 'express';
import { changeIsProvider, getuserdatabytoken } from '../Controllers/userController.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/changeIsProvider",authenticateToken, changeIsProvider);
Router.post("/getuserdatabytoken", getuserdatabytoken);

export default Router;
