import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const authenticateToken = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1] || req.body.encryptedToken; // Check in both headers and body

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        // Attempt to decrypt the token (only if encrypted)
        let decryptedToken;
        try {
            const bytes = CryptoJS.AES.decrypt(token, process.env.ENCRYPTION_SECRET);
            decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        } catch (decryptError) {
            decryptedToken = token; // If decryption fails, assume it's a normal token
        }

        jwt.verify(decryptedToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Token Processing Error:', error);
        return res.status(403).json({ message: 'Failed to process token' });
    }
};

export default authenticateToken;
