import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";


// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const addCar = async (req, res) => {
    const {
        userId,
        userEmail,
        name,
        company,
        model,
        year,
        carType,
        transmissionType,
        fuelType,
        seats,
        pricePerHour,
        pricePerDay,
        city,
        address,
        registrationNumber,
        availability
    } = req.body;

    if (!userId || !userEmail || !name || !company || !model || !year || !pricePerHour || !pricePerDay || !city || !address || !registrationNumber) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if car already exists
        const existingCar = await Car.findOne({ company, model, registrationNumber });
        if (existingCar) {
            return res.status(400).json({ error: "This car already exists" });
        }

        const imagePaths = [];

        // Process images using Sharp (Direct Compression from Memory)
        for (const file of req.files) {
            const compressedFileName = `compressed-${Date.now()}.webp`;
            const compressedFilePath = path.join(uploadsDir, compressedFileName);

            await sharp(file.buffer) // Process directly from memory
                .resize(800) // Resize to 800px width
                .toFormat("webp")
                .webp({ quality: 80 }) // Convert to WebP with quality 80
                .toFile(compressedFilePath); // Save compressed image

            imagePaths.push(`/uploads/${compressedFileName}`); // Store path
        }

        // Create car in DB
        const newCar = await Car.create({
            provider_id: userId,
            providerEmailId: userEmail,
            providerName: name,
            company,
            model,
            year,
            carType,
            transmissionType,
            fuelType,
            seats,
            pricePerHour,
            pricePerDay,
            city,
            address,
            registrationNumber,
            availability,
            images: imagePaths, // Store only compressed image paths
        });

        // Update user's provided cars
        await User.findOneAndUpdate(
            { email: userEmail },
            { $push: { carsProvided: newCar._id } }
        );

        res.status(201).json({ message: "Car added successfully", car: newCar });
    } catch (err) {
        console.error("Error adding car:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const getCarsByIds = async (req, res) => {
    const { carIds } = req.body;
    if (!Array.isArray(carIds) || !carIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ error: 'Invalid car IDs' });
    }
    try {
        const cars = await Car.find({ _id: { $in: carIds } });
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCar = async (req, res) => {
    const { carId } = req.params;

    try {
        // Step 1: Find the car by ID
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        // Step 2: Delete associated images from the uploads folder
        if (car.images && car.images.length > 0) {
            car.images.forEach((imagePath) => {
                const fullPath = path.join(process.cwd(), imagePath); // Get absolute path
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath); // Delete the file
                }
            });
        }

        // Step 3: Remove carId from the user's carsProvided array
        const userId = car.provider_id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.carsProvided = user.carsProvided.filter(id => id.toString() !== carId);
        await user.save();

        // Step 4: Delete the car document from the database
        await Car.deleteOne({ _id: carId });

        res.status(200).json({ message: "Car and associated images deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ error: "An error occurred while deleting the car" });
    }
};




export const getRandomCars = async (req, res) => {
    try {
        // Fetch all cars from the database
        const cars = await Car.find();

        if (!cars || cars.length === 0) {
            return res.status(404).json({ message: 'No cars found.' });
        }

        // Shuffle the cars and take the first three
        const randomCars = cars.sort(() => 0.5 - Math.random()).slice(0, 3);

        res.status(200).json(randomCars);
    } catch (error) {
        console.error('Error fetching random cars:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
