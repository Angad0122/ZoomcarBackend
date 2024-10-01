import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const authenticateToken = (req, res, next) => {
    const { encryptedToken } = req.body;

    if (!encryptedToken) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        // Decrypt the token using the ENCRYPTION_SECRET
        const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_SECRET);
        const token = bytes.toString(CryptoJS.enc.Utf8);
        // Verify the decrypted token using JWT_SECRET
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(403).json({ message: 'Invalid token from middleware' });
            }

            // Attach user data to the request object
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Token Decryption Error:', error);
        return res.status(403).json({ message: 'Failed to decrypt the token' });
    }
};

export default authenticateToken;
