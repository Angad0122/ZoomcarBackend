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


export const verifytoken = async (req, res) => {
    const { encryptedToken } = req.body;
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_SECRET);
        const token = bytes.toString(CryptoJS.enc.Utf8);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // If there is an error in verification, return an error response
                return res.status(403).json({ success: false, message: 'Invalid token' });
            }
            // If token is verified, return success response
            res.status(200).json({ success: true, message: 'Token verified successfully', decoded });
        });
    } catch (error) {
        console.log("Error while verifying token:", error);
        return res.status(403).json({ success: false, message: 'Error during token decryption' });
    }
};





