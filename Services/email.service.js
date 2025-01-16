import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_MAIL,
        to: email,
        subject: `Your OTP Code ${otp}`,
        text: `Your OTP Code is ${otp}. /n Your otp is valid for 10 minutes, Have a nice drive.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

export const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); 
};
