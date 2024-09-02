import express from 'express';
import { addCar } from '../Controllers/carController.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/addCar", addCar);

export default Router;
