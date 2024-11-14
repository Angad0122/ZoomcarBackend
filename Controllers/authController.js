import User from '../Models/userModel.js';
import TempUser from '../Models/tempUserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';


import { sendOtpEmail, generateOtp } from '../Services/emailService.js';

const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id,
            email:user.email,        
        },
        process.env.JWT_SECRET, 
        { expiresIn: '1d' } 
    );
};

const encryptToken = (tok) => {
    return CryptoJS.AES.encrypt(tok, process.env.ENCRYPTION_SECRET).toString();
};







//==========================================================================================
export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log(email,password);
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await User.updateOne({ email }, { otp, otpExpires });
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const verifyloginotp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Clear OTP and expiration
        await User.updateOne({ email }, { $unset: { otp: "", otpExpires: "" } });

        // Generate a new JWT token
        const token = generateToken(user);
        
        // Encrypt the token
        const encryptedToken = encryptToken(token);        
        

        res.status(200).json({ message: 'OTP verified successfully. You are now logged in.', authtoken: encryptedToken,userId:user._id, name: user.name, userEmail:user.email, phone:user.phone, city:user.city, gender:user.gender, isProvider:user.isProvider, carsProvided:user.carsProvided});
    } catch (err) {
        console.error('Error during OTP verification:', err);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


export const signup = async (req, res) => {
    const { name, email, phone, gender, city, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const otp = generateOtp();
        const hashedPassword = await bcrypt.hash(password, 10);

        const tempUser = {
            name,
            email,
            phone,
            gender,
            city,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
        };

        await TempUser.create(tempUser);

        await sendOtpEmail(email, otp);

        res.status(201).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

    export const verifyOtp = async (req, res) => {
        const { email, otp } = req.body;
        console.log(email, otp);
    
        try {
            const user = await TempUser.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            if (user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }
    
            // Create the user in the main User collection
            const newUser = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                city: user.city,
                password: user.password, // Already hashed
            };
    
            await User.create(newUser);
    
            // Delete the temp user after successful OTP verification
            await TempUser.deleteOne({ email });
    
            // Generate a new JWT token
            const token = generateToken(user);
        
            // Encrypt the token
            const encryptedToken = encryptToken(token); 
            res.status(200).json({ message: 'OTP verified successfully. User created.',authtoken: encryptedToken, newUser });
        } catch (err) {
            console.error('Error during OTP verification:', err);
            res.status(500).json({ error: 'Failed to verify OTP' });
        }
    };
