import Car from "../Models/carModel.js";

export const addCar = async (req, res) => {
    const {
        userEmail,
        company,
        model,
        year,
        pricePerHour,
        pricePerDay,
        location,
        registrationNumber,
        availability,
        images
    } = req.body;

    if (!userEmail || !company || !model || !year || !pricePerHour || !pricePerDay || !location || !registrationNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const existingCar = await Car.findOne({
            company,
            model,
            registrationNumber
        });
        if (existingCar) {
            return res.status(400).json({ error: 'This car already exists' });
        }
        const newCar = {
            providerId: userEmail,
            company,
            model,
            year,
            pricePerHour,
            pricePerDay,
            location,
            registrationNumber,
            availability,
            images,
        };

        await Car.create(newCar);

        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

