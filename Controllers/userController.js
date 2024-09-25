import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';







//=================================================================================================================

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


export const getuserdatabytoken = async (req, res) => {
    const { encryptedToken } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_SECRET);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        const decryptedData = jwt.verify(decryptedString, process.env.JWT_SECRET);
        const { userId, name, email, phone, city, gender, isProvider } = decryptedData;
        res.status(200).json({
            message: 'Token decrypted and verified successfully',
            userId,
            name,
            userEmail: email, 
            phone,
            city,
            gender,
            isProvider
        });
    } catch (error) {
        console.error("Decryption or Verification Error: ", error); 
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};








