import Car from "../Models/carModel.js";
import User from "../Models/userModel.js";

export const addCar = async (req, res) => {
    const {
        userEmail,
        company,
        model,
        year,
        carType,
        pricePerHour,
        pricePerDay,
        location,
        registrationNumber,
        availability,
        images
    } = req.body;

    // Check if required fields are present
    if (!userEmail || !company || !model || !year || !pricePerHour || !pricePerDay || !location || !registrationNumber) {
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

        // Create a new car object
        const newCar = await Car.create({
            providerEmailId: userEmail,
            company,
            model,
            year,
            carType,
            pricePerHour,
            pricePerDay,
            location,
            registrationNumber,
            availability,
            images
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
