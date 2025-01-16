import express from 'express';
import { addCar, deleteCar, getCarsByIds, getRandomCars } from '../Controllers/car.controller.js';
import authenticateToken from '../Middlewares/authMiddleware.js'

const Router = express.Router();

Router.post("/addCar", authenticateToken, addCar);
Router.post("/deleteCar/:carId", authenticateToken, deleteCar);
Router.post("/getCarsByIds", authenticateToken, getCarsByIds);
Router.post("/getRandomCars", getRandomCars);


export default Router;
