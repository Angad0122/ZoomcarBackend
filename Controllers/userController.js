import User from "../Models/userModel.js";


export const changeIsProvider = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isProvider = true;
        await user.save();

        res.status(200).json({ message: 'User status updated successfully' });
    } catch (err) {
        console.error('Error updating user status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
