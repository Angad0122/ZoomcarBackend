import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";
import mongoose from 'mongoose';
import sharp from 'sharp';

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
        availability,
        images
    } = req.body;
    
    
    // Check if required fields are present
    if (!userId || !userEmail || !name || !company || !model || !year || !pricePerHour || !pricePerDay || !city || !address || !registrationNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Check if the car already exists
        const existingCar = await Car.findOne({
            company,
            model,
            registrationNumber
        });
        if (existingCar) {
            return res.status(400).json({ error: 'This car already exists' });
        }

        // Process and compress images
        const processedImages = await Promise.all(
            images.map(async (image) => {
                const imageBuffer = Buffer.from(image.split(",")[1], "base64"); // Convert base64 to buffer

                // Check the size of the image and compress if needed
                const compressedImage = await sharp(imageBuffer)
                    .resize({ width: 800 }) // Resize if needed
                    .jpeg({ quality: 80 }) // Adjust quality to reduce size
                    .toBuffer();

                // Convert the buffer back to base64 to store in MongoDB
                return `data:image/jpeg;base64,${compressedImage.toString("base64")}`;
            })
        );

        // Create a new car object with processed images
        const newCar = await Car.create({
            provider_id: userId,
            providerEmailId: userEmail,
            providerName:name,
            company,
            model,
            year,
            carType,
            fuelType:fuelType,
            transmissionType:transmissionType,
            seats:seats,
            pricePerHour,
            pricePerDay,
            city,
            address,
            registrationNumber,
            availability,
            images: processedImages, // Save compressed images
        });

        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the new car's _id to the user's carsProvided array
        user.carsProvided.push(newCar._id);
        
        // Save the updated user
        await user.save();

        // Respond with success
        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).json({ error: 'Internal server error' });
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
        // Step 1: Find the car by ID and ensure it exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        // Step 2: Remove carId from the user's carsProvided array
        const userId = car.provider_id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.carsProvided = user.carsProvided.filter(id => id.toString() !== carId);
        await user.save();

        // Step 3: Delete the car document using deleteOne()
        await Car.deleteOne({ _id: carId });

        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error(error);
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
