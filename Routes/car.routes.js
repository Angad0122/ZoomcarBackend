import express from "express";
import { addCar, deleteCar, getCarsByIds, getRandomCars } from "../Controllers/car.controller.js";
import authenticateToken from "../Middlewares/authMiddleware.js";
import upload from "../Middlewares/multerMiddleware.js"; // Use updated multer setup

const Router = express.Router();

Router.post("/addCar", authenticateToken, upload.array("images", 5), addCar);
Router.post("/deleteCar/:carId", authenticateToken, deleteCar);
Router.post("/getCarsByIds", authenticateToken, getCarsByIds);
Router.post("/getRandomCars", getRandomCars);

export default Router;
