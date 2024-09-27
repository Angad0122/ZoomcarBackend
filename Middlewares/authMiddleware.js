const authenticateToken = (req, res, next) => {
    const encryptedToken = localStorage.getItem("selfsteerAuthToken"); 
    
    if (!encryptedToken) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_SECRET);
    const token = bytes.toString(CryptoJS.enc.Utf8);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token from middleware' });
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;
