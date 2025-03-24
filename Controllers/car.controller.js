import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import sharp from "sharp"; // Import sharp for image compression

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addCar = async (req, res) => {
    const {
        userId, userEmail, name, company, model, year, carType, transmissionType, fuelType, seats,
        pricePerHour, pricePerDay, city, address, registrationNumber, availability
    } = req.body;

    if (!userId || !userEmail || !name || !company || !model || !year || !pricePerHour || !pricePerDay || !city || !address || !registrationNumber) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const imageUrls = [];

        // Process and Upload Images to Cloudinary
        for (const file of req.files) {
            const compressedBuffer = await sharp(file.buffer)
                .webp({ quality: 70 }) // Convert to webp with 70% quality
                .resize(1000) // Resize width to 800px
                .toBuffer();

            const uploadedImage = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "car_rentals", format: "webp" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(compressedBuffer);
            });

            imageUrls.push(uploadedImage.secure_url);
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
            images: imageUrls, // Store Cloudinary URLs
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

        // Step 2: Delete associated images from Cloudinary
        if (car.images && car.images.length > 0) {
            for (const imageUrl of car.images) {
                const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public_id
                await cloudinary.uploader.destroy(`car_rentals/${publicId}`); // Delete from Cloudinary
            }
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
