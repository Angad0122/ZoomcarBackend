import express from 'express';
import { changeIsProvider } from '../Controllers/userController.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/changeIsProvider",authenticateToken, changeIsProvider);

export default Router;
