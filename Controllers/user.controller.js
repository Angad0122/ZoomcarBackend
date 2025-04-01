import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';



//=================================================================================================================

export const changeIsProvider = async (req, res) => {
    console.log("Received request body:", req.body); // Debug log
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Before updating isProvider:", user.isProvider);
        user.isProvider = true;
        user.role = 'provider';
        await user.save();
        console.log("Updated user:", user);

        res.status(200).json({ message: 'User status updated successfully' });
    } catch (err) {
        console.error('Error updating user status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const verifytoken = async (req, res) => {
    const { encryptedToken } = req.body;

    try {
        // Decrypt the token using CryptoJS
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_SECRET);
        const token = bytes.toString(CryptoJS.enc.Utf8);

        // Verify the decrypted token using JWT
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid token' });
            }

            // Log decoded token for debugging
            console.log('Decoded Token:', decoded);

            const { role } = decoded; // Correct extraction of role

            return res.status(200).json({
                success: true,
                message: 'Token verified successfully',
                userRole: role, // Explicitly return the role as userRole in the response
            });
        });
    } catch (error) {
        console.error("Error while verifying token:", error.message);
        return res.status(403).json({ success: false, message: 'Error during token decryption' });
    }
};




export const updateUserDetails = async (req, res) => {
    const { gender, city, phone, userEmail } = req.body;
  
    try {
      const user = await User.findOne({ email:userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Only update fields that are provided in the request body
      if (gender) user.gender = gender;
      if (city) user.city = city;
      if (phone) user.phone = phone;
  
      await user.save();
      res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
