import express from 'express';
import { addCar, deleteCar, getCarsByIds } from '../Controllers/carController.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/addCar", authenticateToken, addCar);
Router.post("/deleteCar/:carId", authenticateToken, deleteCar);
Router.post("/getCarsByIds", authenticateToken, getCarsByIds);


export default Router;
